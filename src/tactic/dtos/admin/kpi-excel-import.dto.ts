import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';

export class KpiExcelImportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unit: string;

  @ApiProperty({
    enum: KpiMeasuringFrequencyEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(KpiMeasuringFrequencyEnum)
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum;
}
