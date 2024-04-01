import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StageCreateDto } from './stage-create.dto';

export class FunnelCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  stages: StageCreateDto[];
}
