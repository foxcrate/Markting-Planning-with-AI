import { IsArray, IsOptional, IsString } from 'class-validator';
import { StageCreateDto } from './stage-create.dto';

export class FunnelUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  stages: StageCreateDto[];
}
