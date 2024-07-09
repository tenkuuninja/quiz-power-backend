import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity, QuizEntity } from '../../entities';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizEntity, QuestionEntity]),
    JwtModule,
    HttpModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
