import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TacticStepCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
