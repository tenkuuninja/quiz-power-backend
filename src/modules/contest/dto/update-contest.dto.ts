import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';
import { EQuestionType } from '../../../common/enums/entity.enum';

class CreateContestQuestionOptionDto {
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

class UpdateContestQuestionDto {
  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  contestId: number;

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

  @Type(() => Array<CreateContestQuestionOptionDto>)
  @IsArray()
  options: CreateContestQuestionOptionDto[];
}

class UpdateContestCategoryDto {
  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  name: string;
}

export class UpdateContestDto {
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

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  status: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  visibility: number;

  // @Type(() => Array<UpdateContestQuestionDto>)
  @IsArray()
  questions: UpdateContestQuestionDto[];

  @IsArray()
  categories: UpdateContestCategoryDto[];
}
