import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StageCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
