import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TacticKpiEntryDeleteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  kpiEntryId: number;
}
