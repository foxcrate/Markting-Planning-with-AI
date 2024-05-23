import { IsOptional, IsString } from 'class-validator';

export class GlobalStageUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
