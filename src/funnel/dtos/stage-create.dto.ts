import { IsNotEmpty, IsString } from 'class-validator';

export class StageCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;
}
