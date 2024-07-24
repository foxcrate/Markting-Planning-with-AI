import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';

export class TacticUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: KpiCreateDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => KpiCreateDto)
  kpis: KpiCreateDto[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  private: boolean;

  @ApiProperty()
  @IsOptional()
  globalStageId: number;

  @ApiProperty({
    type: TacticStepCreateDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TacticStepCreateDto)
  steps: TacticStepCreateDto[];
}
