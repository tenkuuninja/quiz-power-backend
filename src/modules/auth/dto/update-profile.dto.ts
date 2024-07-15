import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class UpdateProfileDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  name: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  avatar: string;
}
