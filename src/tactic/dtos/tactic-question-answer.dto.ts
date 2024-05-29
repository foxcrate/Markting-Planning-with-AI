import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TacticQuestionAnswer {
  @IsNotEmpty()
  @IsNumber()
  funnelId: number;

  @IsNotEmpty()
  @IsNumber()
  stageId: number;

  @IsString()
  answer: string;
}
