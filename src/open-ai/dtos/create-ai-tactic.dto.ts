import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNotEmpty()
  @IsNumber()
  funnelId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stageId: number;
}
