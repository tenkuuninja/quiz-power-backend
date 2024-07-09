import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteQuizDto {
  @IsNumberString()
  @ApiProperty({ default: '' })
  id: string;
}
