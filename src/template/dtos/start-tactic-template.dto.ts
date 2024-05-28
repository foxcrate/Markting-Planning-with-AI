import { IsNotEmpty, IsNumber } from 'class-validator';

export class StartTacticTemplateDto {
  @IsNotEmpty()
  @IsNumber()
  funnelId: number;

  @IsNotEmpty()
  @IsNumber()
  stageId: number;
}
