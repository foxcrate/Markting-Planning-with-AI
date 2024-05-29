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
