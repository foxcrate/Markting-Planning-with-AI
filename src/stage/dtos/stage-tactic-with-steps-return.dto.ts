import { ApiProperty } from '@nestjs/swagger';
import { StageTacticStepsDto } from './stage-tactics-steps.dto';
import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { KpiReturnDto } from 'src/kpi/dtos/return.dto';

export class StageTacticWithStepsReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  checked: boolean;

  @ApiProperty({
    type: KpiReturnDto,
    isArray: true,
  })
  kpis: KpiReturnDto[];

  @ApiProperty()
  theOrder: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  globalStage: GlobalStageReturnDto;

  @ApiProperty({ type: StageTacticStepsDto, isArray: true })
  steps: StageTacticStepsDto[];
}
