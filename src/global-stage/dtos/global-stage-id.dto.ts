import { IsNotEmpty } from 'class-validator';

export class GlobalStageIdDto {
  @IsNotEmpty()
  globalStageId: number;
}
