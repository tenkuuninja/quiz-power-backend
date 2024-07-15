import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';
import { EQuestionType } from '../../../common/enums/entity.enum';

class CreateQuizQuestionOptionDto {
  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  questionId: number;

  @IsString()
  @ApiProperty({ default: '' })
  content: string;

  @IsBoolean()
  @ApiProperty({ default: '' })
  isCorrect: boolean;
}

class UpdateQuizQuestionDto {
  @IsNumber()
  @IsNullable()
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
  @IsArray()
  options: CreateQuizQuestionOptionDto[];
}

class UpdateQuizCategoryDto {
  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  name: string;
}

export class UpdateQuizDto {
  @IsNumber()
  @ApiProperty({ default: '' })
  id: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  userId: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  name: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  image: string;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  status: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  visibility: number;

  // @Type(() => Array<UpdateQuizQuestionDto>)
  @IsArray()
  questions: UpdateQuizQuestionDto[];

  @IsArray()
  categories: UpdateQuizCategoryDto[];
}
