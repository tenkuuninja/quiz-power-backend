import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class JoinContestDto {
  userId: number;

  @IsString()
  @ApiProperty({ default: '' })
  name: string;

  @IsNumber()
  @IsNullable()
  @ApiProperty({ default: '' })
  avatar: number;

  @IsString()
  @ApiProperty({ default: '' })
  contestId: number;
}
