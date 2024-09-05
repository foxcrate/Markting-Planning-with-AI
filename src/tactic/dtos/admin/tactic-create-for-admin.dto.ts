import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TacticStepCreateDto } from '.././tactic-step-create.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';

export class TacticCreateForAdminDto {
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
