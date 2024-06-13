import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticStepEntity } from '../tactic-step.entity';
import { ApiProperty } from '@nestjs/swagger';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';

export class TacticReturnDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
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
  private: boolean;
  @ApiProperty()
  userId: number;
  @ApiProperty({ type: TacticStepEntity, isArray: true })
  steps: TacticStepEntity[];
  @ApiProperty()
  globalStage: GlobalStageReturnDto;
}
