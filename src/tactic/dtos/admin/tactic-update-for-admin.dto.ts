import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TacticStepCreateDto } from '.././tactic-step-create.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';

export class TacticUpdateForAdminDto {
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
  @IsOptional()
  globalStageId: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;

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
