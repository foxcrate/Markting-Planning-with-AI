import { ApiProperty } from '@nestjs/swagger';
import { KpiMeasuringFrequencyEnum } from 'src/enums/kpi-measuring-frequency.enum';
import { AiCreatedTacticStepDto } from './ai-created-tactic-step.dto';

export class AiCreatedTacticDto {
  @ApiProperty()
  prompt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;

  @ApiProperty()
  kpiName: string;

  @ApiProperty()
  kpiUnit: string;

  @ApiProperty({
    enum: KpiMeasuringFrequencyEnum,
  })
  kpiMeasuringFrequency: KpiMeasuringFrequencyEnum;

  @ApiProperty({ type: AiCreatedTacticStepDto, isArray: true })
  steps: AiCreatedTacticStepDto[];
}
