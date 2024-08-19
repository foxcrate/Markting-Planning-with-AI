import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FlowStepCreateDto } from './flow-step-create.dto';
import { Type } from 'class-transformer';

export class FlowCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: FlowStepCreateDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FlowStepCreateDto)
  steps: FlowStepCreateDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  funnelId: number;
}
