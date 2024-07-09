import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class SubmitAnswerDto {
  @IsString()
  @ApiProperty({ default: '' })
  contestId: number;

  @IsString()
  @ApiProperty({ default: '' })
  playerId: number;

  @IsArray()
  @IsNullable()
  @ApiProperty({ default: '' })
  optionIds: number[] | null;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  content: string;

  @IsNumber()
  @ApiProperty({ default: '' })
  contestQuestionId: number;

  @IsDateString()
  @ApiProperty({ default: '' })
  startedAt: string;
}
