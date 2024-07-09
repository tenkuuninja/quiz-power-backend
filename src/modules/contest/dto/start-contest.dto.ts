import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartContestDto {
  userId: number;

  @IsString()
  @ApiProperty({ default: '' })
  contestId: number;
}
