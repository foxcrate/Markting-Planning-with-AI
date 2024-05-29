import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';

export class TacticUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
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

  @IsOptional()
  globalStageId: number;

  @IsArray()
  @IsOptional()
  steps: TacticStepCreateDto[];
}
