import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequiredDataDto } from './required-data.dto';

export class TemplateCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(30, { message: 'Max Characters Number must be at least 30' })
  @Max(1000, { message: 'Max Characters Number must be no more than 1000' })
  @IsNumber()
  maxCharacters: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1, { message: 'Document Number must be at least 1' })
  @Max(6, { message: 'Document Number must be no more than 6' })
  @IsNumber()
  generatedDocumentsNum: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ type: RequiredDataDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RequiredDataDto)
  requiredData: RequiredDataDto[];
}
