import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateQuizQuestionOptionDto {
  @IsNumber()
  @ApiProperty({ default: '' })
  questionId: number;

  @IsString()
  @ApiProperty({ default: '' })
  content: string;

  @IsBoolean()
  @ApiProperty({ default: '' })
  isCorrect: boolean;
}
