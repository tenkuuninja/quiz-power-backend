import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { randomInt, randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { DataSource, Raw, Repository } from 'typeorm';
import {
  AnswerEntity,
  ContestEntity,
  ContestQuestionEntity,
  ContestQuestionOptionEntity,
  ContestQuizEntity,
  PlayerEntity,
  QuizEntity,
  UserEntity,
} from '../../entities';
import { codeStore, contestStore } from './constants/store';
import { ContestSocketGateway } from './contest.socket-gateway';
import {
  CreateContestDto,
  FindContestDto,
  GetDetailContestDto,
  GetListContestDto,
  StartContestDto,
} from './dto';
import { DeleteContestDto } from './dto/delete-contest.dto';
import { JoinContestDto } from './dto/join-contest.dto';
import { EContestStatus } from './enum';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { EQuestionType } from '../quiz/enum';
import { EContestType } from '../../common/enums/entity.enum';

@Injectable()
export class ContestService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ContestEntity)
    private contestRepository: Repository<ContestEntity>,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    private contestGateway: ContestSocketGateway,
  ) {}

  async getListContest(dto: GetListContestDto) {
    const contest = await this.contestRepository.find({
      where: {
        name: dto.search
          ? Raw((alias) => `LOWER(${alias}) Like LOWER(:search)`, {
              search: `%${dto.search}%`,
            })
          : undefined,
        user: {
          id: dto.userId,
        },
      },
      relations: ['contestQuiz', 'players'],
      order: {
        createdAt: 'DESC',
      },
      take: +dto.pageSize,
      skip: +(dto.page - 1) * +dto.pageSize,
    });
    const total = await this.contestRepository.count({
      where: {
        name: dto.search
          ? Raw((alias) => `LOWER(${alias}) Like LOWER(:search)`, {
              search: `%${dto.search}%`,
            })
          : undefined,
        user: {
          id: dto.userId,
        },
      },
    });
    return { data: contest, total: total };
  }

  async getDetailContest(dto: GetDetailContestDto) {
    const contest = await this.contestRepository.findOne({
      where: {
        id: +dto.id,
      },
      relations: [
        'contestQuiz',
        'contestQuiz.questions',
        'contestQuiz.questions.options',
        'players',
        'players.answers',
        'players.answers.contestQuestion',
      ],
    });

    return { data: contest };
  }

  async createContest(dto: CreateContestDto) {
    const id = randomUUID();
    const joinCode = randomInt(999999);

    const user = await this.userRepository.findOne({
      where: {
        id: dto?.userId,
      },
    });

    contestStore[id] = {
      ...dto,
      id: id,
      contestType: dto?.contestType || EContestType.Live,
      joinCode: joinCode,
      user: user,
      name: dto?.name,
      status: EContestStatus.Idle,
      createdAt: dayjs().toISOString(),
      socketIds: [] as string[],
      players: [],
    };
    codeStore[joinCode] = id;

    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const currentQuiz = await transactionalEntityManager.findOne(
          QuizEntity,
          {
            relations: ['questions', 'questions.options'],
            where: {
              id: +dto?.quizId,
            },
          },
        );

        if (!currentQuiz) {
          throw new BadRequestException('Quiz not found');
        }

        const contestQuiz = await transactionalEntityManager.findOne(
          ContestQuizEntity,
          {
            relations: ['quiz.categories', 'questions', 'questions.options'],
            where: {
              quiz: {
                id: +dto.quizId,
              },
              version: currentQuiz.version,
            },
          },
        );

        if (contestQuiz) {
          contestStore[id].contestQuiz = contestQuiz;
          return;
        }

        const quiz = new QuizEntity();
        quiz.id = +dto.quizId;

        let newContestQuiz = new ContestQuizEntity();
        newContestQuiz.name = currentQuiz?.name;
        newContestQuiz.image = currentQuiz?.image;
        newContestQuiz.version = currentQuiz?.version;
        newContestQuiz.quiz = quiz;

        newContestQuiz = await transactionalEntityManager.save(
          ContestQuizEntity,
          newContestQuiz,
        );

        for (const questionDto of currentQuiz?.questions || []) {
          let question = new ContestQuestionEntity();
          question.content = questionDto?.content;
          question.questionType = questionDto?.questionType;
          question.contestQuiz = newContestQuiz;
          question = await transactionalEntityManager.save(
            ContestQuestionEntity,
            question,
          );

          for (const optionDto of questionDto?.options || []) {
            const option = new ContestQuestionOptionEntity();
            option.content = optionDto?.content;
            option.isCorrect = optionDto?.isCorrect || false;
            option.contestQuestion = question;
            await transactionalEntityManager.save(
              ContestQuestionOptionEntity,
              option,
            );
          }
        }

        newContestQuiz = await transactionalEntityManager.findOne(
          ContestQuizEntity,
          {
            relations: ['quiz.categories', 'questions', 'questions.options'],
            where: {
              quiz: {
                id: +dto.quizId,
              },
              version: currentQuiz.version,
            },
          },
        );

        contestStore[id].contestQuiz = newContestQuiz;
      },
    );

    return {
      result: 'success',
      data: contestStore[id],
    };
  }

  async startContest(dto: StartContestDto) {
    const contest = contestStore[dto?.contestId];

    if (!contest) {
      throw new BadRequestException('Contest not found!');
    }

    contest.startedAt = dayjs().toISOString();
    contest.status = EContestStatus.Started;

    this.contestGateway.updateContestToClient(contest);

    return {
      result: 'success',
    };
  }

  async getContestByCode(dto: FindContestDto) {
    const contestId = codeStore[dto.code];
    console.log('codeStore', codeStore);
    if (!contestId) {
      throw new BadRequestException('Contest not found!');
    }

    const contest = contestStore[contestId];
    if (!contest) {
      throw new BadRequestException('Contest not found!');
    }

    return {
      result: 'success',
      data: contest,
    };
  }

  async joinContest(dto: JoinContestDto) {
    const contest = contestStore[dto?.contestId];

    if (!contest) {
      throw new BadRequestException('Contest not found!');
    }

    let player = null;

    if (dto.userId) {
      const existPlayer = contest?.players?.find(
        (player) => player?.user?.id === dto.userId,
      );

      if (existPlayer) {
        player = existPlayer;
      }
    }

    if (!player) {
      player = {
        id: crypto.randomUUID(),
        name: dto?.name,
        avatar: dto?.avatar,
        score: 0,
        streak: 0,
        user: null,
        answers: [],
      };

      if (dto.userId) {
        const user = await this.userRepository.findOne({
          where: {
            id: +dto?.userId,
          },
        });

        if (user) {
          player.user = user;
        }
      }
      contest?.players?.push(player);
    }

    this.contestGateway.updateContestToClient(contest);

    return {
      result: 'success',
      data: player,
    };
  }

  async submitAnswer(dto: SubmitAnswerDto) {
    const contest = contestStore[dto?.contestId];
    if (!contest) {
      throw new BadRequestException('Contest not found!');
    }

    contest.status = EContestStatus.Started;

    console.log(contest?.contestQuiz?.questions);

    const question = contest?.contestQuiz?.questions?.find(
      (question) => question?.id === dto?.contestQuestionId,
    );
    console.log(question);
    if (!question) {
      throw new BadRequestException('Question not found!');
    }

    const player = contest?.players?.find(
      (player) => player?.id === dto?.playerId,
    );
    if (!player) {
      throw new BadRequestException('Player not found!');
    }

    let isCorrect = true;

    switch (question?.questionType) {
      case EQuestionType.SingleChoice:
        for (const optionId of dto?.optionIds || []) {
          const selectOption = question?.options?.find(
            (option) => option?.id === optionId,
          );
          if (!selectOption?.isCorrect) {
            isCorrect = false;
            break;
          }
        }
        break;

      case EQuestionType.MultipleChoice:
        for (const optionId of dto?.optionIds || []) {
          const selectOption = question?.options?.find(
            (option) => option?.id === optionId,
          );
          if (!selectOption?.isCorrect) {
            isCorrect = false;
            break;
          }
        }
        const correctOptionWithoutSelect = question?.options?.find(
          (option) =>
            dto?.optionIds?.find((oId) => oId !== option?.id) &&
            option.isCorrect,
        );
        if (correctOptionWithoutSelect) {
          isCorrect = false;
        }
        break;

      case EQuestionType.TextEntryWithLength:
        const selectOption = question?.options?.find(
          (option) =>
            option?.content?.toLowerCase() === dto?.content?.toLowerCase(),
        );
        if (!selectOption?.isCorrect) {
          isCorrect = false;
        }
        break;

      default:
        break;
    }

    // calc score
    const baseScore = 400;
    const baseTime = 30;
    const scorePerSecond = 10;
    let score = 0;
    if (isCorrect) {
      const streakBonus = (player.streak * 10 + 100) / 100;
      player.streak++;
      score += baseScore * streakBonus;
    } else {
      player.streak = 0;
    }
    const now = dayjs();
    const duration = now.diff(dayjs(dto.startedAt), 'second');
    score += (baseTime - duration) * scorePerSecond;
    if (score < 0) {
      score = 0;
    }
    player.score += score;

    const newAnswer = {
      optionIds: dto?.optionIds,
      content: dto?.content,
      isCorrect: isCorrect,
      score: score,
      startedAt: dayjs(dto?.startedAt).toISOString(),
      endedAt: now.toISOString(),
      contestQuestion: { id: dto?.contestQuestionId },
    };
    player?.answers?.push(newAnswer);

    this.contestGateway.updateContestToClient(contest);

    return {
      result: 'success',
    };
  }

  async endContest(dto: StartContestDto) {
    const contest = contestStore[dto?.contestId];

    if (!contest) {
      throw new BadRequestException('Contest not found!');
    }

    contest.status = EContestStatus.Ended;
    contest.endedAt = dayjs().toISOString();

    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        let newContest = new ContestEntity();
        newContest.contestQuiz = contest?.contestQuiz;
        newContest.user = contest?.user;
        newContest.name = contest?.name;
        newContest.startedAt = contest?.startedAt;
        newContest.endedAt = contest?.endedAt;
        newContest.createdAt = contest?.createdAt;

        newContest = await transactionalEntityManager.save(
          ContestEntity,
          newContest,
        );

        for (const playerDto of contest?.players || []) {
          let player = new PlayerEntity();
          player.avatar = playerDto?.avatar;
          player.createdAt = playerDto?.createdAt;
          player.name = playerDto?.name;
          player.score = playerDto?.score;
          player.user = playerDto?.user;
          player.contest = newContest;
          player = await transactionalEntityManager.save(PlayerEntity, player);

          for (const answerDto of playerDto?.answers || []) {
            const answer = new AnswerEntity();
            answer.content = answerDto?.content;
            answer.contestQuestion = answerDto?.contestQuestion;
            answer.score = answerDto?.score;
            answer.startedAt = answerDto?.startedAt;
            answer.endedAt = answerDto?.endedAt;
            answer.isCorrect = answerDto?.isCorrect || false;
            answer.optionIds = answerDto?.optionIds;
            answer.player = player;
            await transactionalEntityManager.save(AnswerEntity, answer);
          }
        }
      },
    );

    this.contestGateway.updateContestToClient(contest);

    return {
      result: 'success',
    };
  }

  async deleteContest(dto: DeleteContestDto) {
    await this.contestRepository.delete({
      id: +dto.id,
    });

    return {
      result: 'success',
    };
  }
}
