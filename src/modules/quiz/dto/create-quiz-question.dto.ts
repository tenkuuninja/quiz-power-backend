import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';
import { EQuestionType } from '../enum';
import { CreateQuizQuestionOptionDto } from './create-quiz-question-option.dto';

export class CreateQuizQuestionDto {
  @IsNumber()
  @ApiProperty({ default: '' })
  quizId: number;

  @IsString()
  @ApiProperty({ default: '' })
  content: string;

  @IsString()
  @ApiProperty({ default: '' })
  questionType: EQuestionType;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  answerLength: number;

  @Type(() => Array<CreateQuizQuestionOptionDto>)
  options: CreateQuizQuestionOptionDto[];
}
