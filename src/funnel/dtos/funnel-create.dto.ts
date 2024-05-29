import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StageCreateDto } from './stage-create.dto';
import { Type } from 'class-transformer';

export class FunnelCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  // @IsArray()
  // @IsOptional()
  // stages: StageCreateDto[];

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => StageCreateDto)
  stages: StageCreateDto[];
}
