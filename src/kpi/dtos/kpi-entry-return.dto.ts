import { ApiProperty } from '@nestjs/swagger';

export class KpiEntryReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  value: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  kpiId: number;
}
