import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteContestDto {
  @IsNumberString()
  @ApiProperty({ default: '' })
  id: string;
}
