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
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';

export class TacticCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  kpiName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  kpiUnit: string;

  @ApiProperty({
    enum: KpiMeasuringFrequencyEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(KpiMeasuringFrequencyEnum)
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  kpiValue: string;

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
