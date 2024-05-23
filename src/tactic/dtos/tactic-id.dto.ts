import { IsNotEmpty } from 'class-validator';

export class TacticIdDto {
  @IsNotEmpty()
  tacticId: number;
}
