import { IsNotEmpty } from 'class-validator';

export class AddTacticToStageIdsDto {
  @IsNotEmpty()
  tacticId: number;

  @IsNotEmpty()
  stageId: number;
}
