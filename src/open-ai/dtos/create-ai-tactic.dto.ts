import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAiTacticDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  @IsNotEmpty()
  library: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  workspaceId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  funnelId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  stageId: number;
}
