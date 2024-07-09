import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SuggestionQuestionDto {
  @IsString()
  @ApiProperty({ default: '' })
  message: string;
}
