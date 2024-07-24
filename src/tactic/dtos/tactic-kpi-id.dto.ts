import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TacticKpiIdDto {
  @ApiProperty()
  @IsNotEmpty()
  tacticId: number;

  @ApiProperty()
  @IsNotEmpty()
  kpiId: number;
}
