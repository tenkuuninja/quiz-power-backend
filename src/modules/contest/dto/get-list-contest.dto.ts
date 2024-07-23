import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../common/decorators/validator.decorator';

export class GetListContestDto {
  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  readonly userId: number;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  readonly search: string;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 1)
  @ApiProperty({ default: '' })
  readonly page: number = 1;

  @IsNumber()
  @IsNullable()
  @Transform(({ value }) => +value || 10)
  @ApiProperty({ default: '' })
  readonly pageSize: number = 10;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  readonly orderField: string;

  @IsString()
  @IsNullable()
  @ApiProperty({ default: '' })
  readonly orderDirection: string;
}
