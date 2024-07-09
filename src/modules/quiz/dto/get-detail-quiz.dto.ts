import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetDetailQuizDto {
  @IsNumberString()
  @ApiProperty({ default: '' })
  id: string;
}
