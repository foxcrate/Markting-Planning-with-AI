import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';
import { Type } from 'class-transformer';

export class TacticCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  benchmarkName: string;

  @IsOptional()
  @IsString()
  benchmarkNumber: string;

  @IsBoolean()
  @IsOptional()
  private: boolean;

  @IsNotEmpty()
  globalStageId: number;

  @IsOptional()
  stageId: string;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TacticStepCreateDto)
  steps: TacticStepCreateDto[];
}
