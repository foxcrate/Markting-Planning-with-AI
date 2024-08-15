import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DocumentRequiredDataDto } from './document-required-data.dto';
import { Type } from 'class-transformer';

export class DocumentUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: DocumentRequiredDataDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DocumentRequiredDataDto)
  requiredData: DocumentRequiredDataDto[];
}
