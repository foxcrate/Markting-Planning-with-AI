import { IsNotEmpty, IsNumber } from 'class-validator';

export class TacticIdAndOrderDto {
  @IsNotEmpty()
  @IsNumber()
  tacticId: number;

  @IsNotEmpty()
  @IsNumber()
  theOrder: number;
}
