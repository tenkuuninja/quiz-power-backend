import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class CreateContestDto {
  userId: number;

  @IsNumber()
  @ApiProperty({ default: '' })
  quizId: number;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  contestType: string;
}
