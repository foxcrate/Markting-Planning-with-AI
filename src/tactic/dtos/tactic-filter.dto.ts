import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TacticsFilterDto {
  @ApiProperty()
  @IsOptional()
  private: boolean;

  @ApiProperty()
  @IsOptional()
  name: string;
}
