import { IsNotEmpty } from 'class-validator';

export class RemoveTacticFromStageDto {
  @IsNotEmpty()
  tacticId: number;

  @IsNotEmpty()
  stageId: number;
}
