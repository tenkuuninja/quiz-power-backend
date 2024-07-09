import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteQuizQuestionDto {
  @IsNumberString()
  @ApiProperty({ default: '' })
  id: string;
}
