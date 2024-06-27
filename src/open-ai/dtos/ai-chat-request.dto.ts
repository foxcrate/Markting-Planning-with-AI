import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AiChatRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

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

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  threadId: number;
}
