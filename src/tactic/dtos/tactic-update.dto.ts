import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TacticUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  benchmarkName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  benchmarkNumber: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  private: boolean;

  @ApiProperty()
  @IsOptional()
  globalStageId: number;

  @ApiProperty({ type: TacticStepCreateDto, isArray: true })
  @IsArray()
  @IsOptional()
  steps: TacticStepCreateDto[];
}
