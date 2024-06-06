import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StageCreateDto } from './stage-create.dto';
import { Type } from 'class-transformer';

export class FunnelUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
