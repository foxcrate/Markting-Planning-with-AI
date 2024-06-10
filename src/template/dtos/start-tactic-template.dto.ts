import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class StartTacticTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  funnelId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stageId: number;
}
