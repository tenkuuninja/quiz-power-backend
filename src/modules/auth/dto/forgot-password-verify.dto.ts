import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class ForgotPasswordVerifyDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  email: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  otp: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  password: string;
}
