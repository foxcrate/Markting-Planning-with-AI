import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class FlowStepCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stageId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tacticId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  order: number;
}
