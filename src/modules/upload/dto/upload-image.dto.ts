import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  IsFile,
  IsNullable,
} from '../../../common/decorators/validator.decorator';

export class UploadImageDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  path: string;

  @IsFile()
  @IsNullable()
  @ApiProperty({ default: '' })
  file: File;
}
