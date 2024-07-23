import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetDetailQuizDto {
  @IsNumber()
  @ApiProperty({ default: '' })
  id: string;
}
