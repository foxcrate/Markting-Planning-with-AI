import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';

export class KpiReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({
    enum: KpiMeasuringFrequencyEnum,
    required: false,
  })
  @IsEnum(KpiMeasuringFrequencyEnum)
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum;

  @ApiProperty()
  tacticId: number;
}
