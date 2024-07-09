import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetDetailContestDto {
  @IsNumberString()
  @ApiProperty({ default: '' })
  id: string;
}
