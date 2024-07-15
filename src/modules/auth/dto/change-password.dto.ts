import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class ChangePasswordDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  oldPassword: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  newPassword: string;
}
