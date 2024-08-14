import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DocumentRequiredDataDto } from './document-required-data.dto';
import { Type } from 'class-transformer';

export class DocumentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: DocumentRequiredDataDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DocumentRequiredDataDto)
  requiredData: DocumentRequiredDataDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  templateId: number;
}
