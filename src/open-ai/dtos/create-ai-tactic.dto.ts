import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAiTacticDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prompt: string;

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
