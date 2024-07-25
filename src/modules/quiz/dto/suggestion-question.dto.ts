import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SuggestionQuestionDto {
  @IsString()
  @ApiProperty({ default: '' })
  message: string;

  @IsNumber()
  @ApiProperty({ default: '' })
  totalQuestion: number;
}
