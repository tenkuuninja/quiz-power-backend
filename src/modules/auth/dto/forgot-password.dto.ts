import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class ForgotPasswordDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  email: string;
}
