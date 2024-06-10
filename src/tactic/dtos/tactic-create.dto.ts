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
import { ApiProperty } from '@nestjs/swagger';

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
