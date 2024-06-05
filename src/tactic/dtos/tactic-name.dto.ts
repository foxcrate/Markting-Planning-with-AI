import { IsOptional } from 'class-validator';

export class TacticNameDto {
  @IsOptional()
  name: string;
}
