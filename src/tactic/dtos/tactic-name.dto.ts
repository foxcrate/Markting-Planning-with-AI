import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TacticNameDto {
  @ApiProperty()
  @IsOptional()
  name: string;
}
