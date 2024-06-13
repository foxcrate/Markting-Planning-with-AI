import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TacticStepCreateDto } from './tactic-step-create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';
import { Type } from 'class-transformer';

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
