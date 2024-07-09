import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class CreateQuizDto {
  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  userId: number;
}
