import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';

export class KpiReturnDto {
  @ApiProperty()
  @IsString()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiProperty({
    enum: KpiMeasuringFrequencyEnum,
    required: false,
  })
  @IsEnum(KpiMeasuringFrequencyEnum)
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum;
}
