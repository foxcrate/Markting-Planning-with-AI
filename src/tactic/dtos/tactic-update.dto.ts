import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';

export class TacticUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  globalStageId: number;

  @IsArray()
  @IsOptional()
  steps: TacticStepCreateDto[];
}
