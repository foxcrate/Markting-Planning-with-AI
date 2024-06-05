import { IsNotEmpty, IsOptional } from 'class-validator';

export class TacticsFilterDto {
  @IsOptional()
  private: boolean;
}
