import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SuggestionAnswerDto {
  @IsString()
  @ApiProperty({ default: '' })
  message: string;

  @IsString()
  @ApiProperty({ default: '' })
  type: string;
}
