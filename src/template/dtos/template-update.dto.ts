import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequiredDataDto } from './required-data.dto';

export class TemplateUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maxCharacters: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  generatedDocumentsNum: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ type: RequiredDataDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequiredDataDto)
  requiredData: RequiredDataDto[];
}
