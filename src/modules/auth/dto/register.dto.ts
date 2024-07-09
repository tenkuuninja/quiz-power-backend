import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class RegisterDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  username: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  password: string;
}
