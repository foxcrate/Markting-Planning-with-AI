import { IsNotEmpty } from 'class-validator';

export class FunnelIdAndStageIdAndTacticIdDto {
  @IsNotEmpty()
  funnelId: number;

  @IsNotEmpty()
  stageId: number;

  @IsNotEmpty()
  tacticId: number;
}
