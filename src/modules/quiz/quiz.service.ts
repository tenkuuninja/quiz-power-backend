import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import htmlToDdf from 'html-pdf-node';
import { firstValueFrom } from 'rxjs';
import { DataSource, Raw, Repository } from 'typeorm';
import { EQuizStatus, EQuizVisibility } from '../../common/enums/entity.enum';
import { ZUKI_API_KEY } from '../../configs/app';
import {
  CategoryEntity,
  QuestionEntity,
  QuestionOptionEntity,
  QuizEntity,
} from '../../entities';
import {
  CreateQuizDto,
  DeleteQuizDto,
  GetDetailQuizDto,
  GetListQuizDto,
  SuggestionAnswerDto,
  SuggestionQuestionDto,
  UpdateQuizDto,
} from './dto';
import path from 'path';
import ejs from 'ejs';

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

  async getListOutstandingQuiz() {
    const quiz = await this.quizRepository.find({
      where: {
        status: EQuizStatus.Published,
        visibility: EQuizVisibility.Public,
      },
      relations: ['questions'],
      take: 16,
      skip: 0,
    });
    return { data: quiz };
  }

  async getListQuiz(dto: GetListQuizDto) {
    const quiz = await this.quizRepository.find({
      where: {
        name: dto.search
          ? Raw((alias) => `LOWER(${alias}) Like LOWER(:search)`, {
              search: `%${dto.search}%`,
            })
          : undefined,
        userId: dto.userId ? dto.userId : dto.userId,
      },
      relations: ['questions'],
      order: {
        createdAt: 'DESC',
      },
      take: +dto.pageSize,
      skip: +(dto.page - 1) * +dto.pageSize,
    });
    const total = await this.quizRepository.count({
      where: {
        name: dto.search
          ? Raw((alias) => `LOWER(${alias}) Like LOWER(:search)`, {
              search: `%${dto.search}%`,
            })
          : undefined,
        userId: dto.userId ? dto.userId : dto.userId,
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
        quiz.image = dto?.image;
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
                content: `Generate for me about 10 questions of this topic \"${dto?.message}\" and 4 options each and mark the correct answer. Returning without markdown an array of json with the content field being the question content, options field is an array of json with the content field being the answer content, isCorrect of type boolean to mark the correct answer, true if content is correct, false if content is wrong. Language is vietnamese`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${ZUKI_API_KEY}`,
            },
          },
        ),
      );

      const rawContent: string = response?.data?.choices?.[0]?.message?.content;
      // console.log(rawContent);
      const options = JSON.parse(rawContent.match(/\[[\w\W]+\]/gm)[0]);

      return {
        result: 'success',
        data: options,
      };
    } catch (error) {
      console.log('suggestAnswerCompletion', error?.response?.data || error);
      throw new Error(error);
    }
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
                content: `Generate for me 4 answers to the ${dto?.type} question \"${dto?.message}\" and mark the correct answer. Returning without markdown an array of json with the content field being the answer content, isCorrect of type boolean to mark the correct answer, true if content is correct, false if content is wrong. Language is vietnamese`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${ZUKI_API_KEY}`,
            },
          },
        ),
      );

      const rawContent: string = response?.data?.choices?.[0]?.message?.content;
      const options = JSON.parse(rawContent.match(/\[[\w\W]+\]/gm)[0]);

      return {
        result: 'success',
        data: options,
      };
    } catch (error) {
      console.log('suggestAnswerCompletion', error?.response?.data || error);
      throw new Error(error);
    }
  }

  async exportQuizPdf(dto: GetDetailQuizDto) {
    const quiz = await this.quizRepository.findOne({
      relations: ['categories', 'questions', 'questions.options'],
      where: {
        id: +dto.id,
      },
    });

    const templatePath = path.join(__dirname, './templates/quiz-pdf.ejs');
    const html = await ejs.renderFile(templatePath, quiz);

    const pdfBuffer: any = await htmlToDdf.generatePdf(
      { content: html },
      { format: 'A4' },
    );

    return { data: pdfBuffer };
  }
}
