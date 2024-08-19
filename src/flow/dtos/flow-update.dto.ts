import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FlowStepCreateDto } from './flow-step-create.dto';
import { Type } from 'class-transformer';

export class FlowUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: FlowStepCreateDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FlowStepCreateDto)
  steps: FlowStepCreateDto[];
}
