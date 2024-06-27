import { ApiProperty } from '@nestjs/swagger';
import { StageTacticStepsDto } from './stage-tactics-steps.dto';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';
import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';

export class StageTacticWithStepsReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  checked: boolean;

  @ApiProperty()
  kpiName: string;

  @ApiProperty()
  kpiUnit: string;

  @ApiProperty({
    enum: KpiMeasuringFrequencyEnum,
    required: false,
  })
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum;

  @ApiProperty()
  kpiValue: string;

  @ApiProperty()
  theOrder: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  globalStage: GlobalStageReturnDto;

  @ApiProperty({ type: StageTacticStepsDto, isArray: true })
  steps: StageTacticStepsDto[];
}
