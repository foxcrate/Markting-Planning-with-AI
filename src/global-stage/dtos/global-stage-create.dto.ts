import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GlobalStageCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
