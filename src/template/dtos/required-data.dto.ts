import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { RequiredDataDataTypeEnum } from 'src/enums/required-data-data-types.enum';

export class RequiredDataDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  placeHolder: string;

  @ApiProperty()
  @IsString()
  toolTip: string;

  @ApiProperty({ enum: RequiredDataDataTypeEnum })
  @IsEnum(RequiredDataDataTypeEnum)
  type: RequiredDataDataTypeEnum;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  options: string[];
}
