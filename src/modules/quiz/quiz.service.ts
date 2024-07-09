import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DataSource, Like, Repository } from 'typeorm';
import {
  CategoryEntity,
  QuestionEntity,
  QuestionOptionEntity,
  QuizEntity,
} from '../../entities';
import {
  CreateQuizDto,
  GetDetailQuizDto,
  GetListQuizDto,
  UpdateQuizDto,
} from './dto';
import { DeleteQuizDto } from './dto/delete-quiz.dto';
import { SuggestionAnswerDto } from './dto/suggestion-answer.dto';
import { SuggestionQuestionDto } from './dto/suggestion-question.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    private httpService: HttpService,
  ) {}

  async getListQuiz(dto: GetListQuizDto) {
    const quiz = await this.quizRepository.find({
      where: {
        name: dto.search ? Like(dto.search) : undefined,
      },
      relations: ['questions'],
      take: +dto.pageSize,
      skip: +(dto.page - 1) * +dto.pageSize,
    });
    const total = await this.quizRepository.count({
      where: {
        name: dto.search ? Like(dto.search) : undefined,
      },
    });
    return { data: quiz, total: total };
  }

  async getDetailQuiz(dto: GetDetailQuizDto) {
    const quiz = await this.quizRepository.findOne({
      relations: ['categories', 'questions', 'questions.options'],
      where: {
        id: +dto.id,
      },
    });
    return { data: quiz };
  }

  async createQuiz(dto: CreateQuizDto) {
    const newQuiz = await this.quizRepository.save({
      user: {
        id: dto?.userId,
      },
      name: '',
    });

    return {
      result: 'success',
      data: newQuiz,
    };
  }

  async updateQuiz(dto: UpdateQuizDto) {
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        let quiz = new QuizEntity();
        quiz.id = dto?.id;
        quiz.name = dto?.name;
        quiz.visibility = dto?.visibility;
        quiz.status = dto?.status;

        if (dto.categories) {
          quiz.categories = [];
          for (const categoryDto of dto?.categories || []) {
            const category = new CategoryEntity();
            category.id = categoryDto.id;
            category.name = categoryDto.name;
            quiz.categories.push(category);
          }
        }

        quiz.questions = [];
        for (const questionDto of dto?.questions || []) {
          let question = new QuestionEntity();
          question.id = questionDto?.id;
          question.content = questionDto?.content;
          question.questionType = questionDto?.questionType;
          question.answerLength = questionDto?.answerLength;
          question.quiz = quiz;
          question = await transactionalEntityManager.save(
            QuestionEntity,
            question,
          );

          question.options = [];
          for (const optionDto of questionDto?.options || []) {
            const option = new QuestionOptionEntity();
            option.id = optionDto?.id;
            option.content = optionDto?.content;
            option.isCorrect = optionDto?.isCorrect || false;
            option.question = question;
            await transactionalEntityManager.save(QuestionOptionEntity, option);
            question.options.push(option);
          }
          quiz.questions.push(question);
        }

        console.log(quiz);

        quiz = await transactionalEntityManager.save(QuizEntity, quiz);
        await transactionalEntityManager.increment(
          QuizEntity,
          { id: dto?.id },
          'version',
          1,
        );
      },
    );

    return {
      result: 'success',
    };
  }

  async deleteQuiz(dto: DeleteQuizDto) {
    await this.quizRepository.delete({
      id: +dto.id,
    });

    return {
      result: 'success',
    };
  }

  async suggestQuestionCompletion(dto: SuggestionQuestionDto) {
    // await this.quizRepository.delete({
    //   id: +dto.id,
    // });

    // https://zukijourney.xyzbot.net/v1/chat/completions

    return {
      result: 'success',
    };
  }

  async suggestAnswerCompletion(dto: SuggestionAnswerDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://zukijourney.xyzbot.net/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo-16k',
            messages: [
              {
                role: 'system',
                content: 'You are a quiz maker assistant',
              },
              {
                role: 'user',
                content: `Generate for me 4 answers to the ${dto?.type} question \"${dto?.message}\" and mark the correct answer. Returning without markdown an array of json with the content field being the answer content, isCorrect of type boolean to mark the correct answer, true if content is correct, false if content is wrong`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${'zu-133136731ff9ed2b03db1c439618ccea'}`,
            },
          },
        ),
      );

      const rawContent = response?.data?.choices?.[0]?.message?.content;
      const options = JSON.parse(rawContent);

      return {
        result: 'success',
        data: options,
      };
    } catch (error) {
      console.log('suggestAnswerCompletion', error?.response?.data);
      throw new Error(error);
    }
  }
}
