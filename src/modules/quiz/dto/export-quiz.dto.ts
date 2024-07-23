import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ExportQuizDto {
  @IsNumber()
  @ApiProperty({ default: '' })
  id: number;
}
