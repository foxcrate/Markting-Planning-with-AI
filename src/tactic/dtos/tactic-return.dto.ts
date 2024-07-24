import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticStepEntity } from '../tactic-step.entity';
import { ApiProperty } from '@nestjs/swagger';
import { KpiReturnDto } from 'src/kpi/dtos/return.dto';

export class TacticReturnDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  @ApiProperty({
    type: KpiReturnDto,
    isArray: true,
  })
  kpis: KpiReturnDto[];

  @ApiProperty()
  private: boolean;
  @ApiProperty()
  userId: number;
  @ApiProperty({ type: TacticStepEntity, isArray: true })
  steps: TacticStepEntity[];
  @ApiProperty()
  globalStage: GlobalStageReturnDto;
}
