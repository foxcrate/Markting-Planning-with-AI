import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TacticStepCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  attachment: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
