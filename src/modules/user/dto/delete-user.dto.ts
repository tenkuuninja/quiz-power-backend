import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteUserDto {
  @IsNumberString()
  @ApiProperty({ default: '' })
  id: string;
}
