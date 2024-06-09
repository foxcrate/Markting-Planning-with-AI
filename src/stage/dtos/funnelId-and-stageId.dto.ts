import { IsNotEmpty } from 'class-validator';

export class FunnelIdAndStageIdDto {
  @IsNotEmpty()
  stageId: number;

  @IsNotEmpty()
  funnelId: number;
}
