import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class CreateContestDto {
  userId: number;

  @IsNumber()
  @ApiProperty({ default: '' })
  quizId: number;

  @IsString()
  @ApiProperty({ default: '' })
  name: string;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  contestType: string;
}
