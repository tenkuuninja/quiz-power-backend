import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class GetProfileDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  id: number;
}
