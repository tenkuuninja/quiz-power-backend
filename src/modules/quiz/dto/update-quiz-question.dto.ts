import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';
import { EQuestionType } from '../enum';
import { CreateQuizQuestionOptionDto } from './create-quiz-question-option.dto';

export class UpdateQuizQuestionDto {
  @IsNumber()
  @ApiProperty({ default: '' })
  id: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  quizId: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  content: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  questionType: EQuestionType;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  answerLength: number;

  @Type(() => Array<CreateQuizQuestionOptionDto>)
  options: CreateQuizQuestionOptionDto[];
}
