import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EndContestDto {
  userId: number;

  @IsString()
  @ApiProperty({ default: '' })
  contestId: number;
}
