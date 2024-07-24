import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';

export class TacticCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
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

  // @ApiProperty()
  @IsBoolean()
  @IsOptional()
  instance: boolean;

  @ApiProperty()
  @IsNotEmpty()
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
