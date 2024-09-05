import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticStepEntity } from '../tactic-step.entity';
import { ApiProperty } from '@nestjs/swagger';
import { KpiReturnDto } from 'src/kpi/dtos/return.dto';
import { TacticUserDto } from './tactic-user.dto';

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
  hidden: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: TacticUserDto })
  user: TacticUserDto;

  @ApiProperty({ type: TacticStepEntity, isArray: true })
  steps: TacticStepEntity[];
  @ApiProperty()
  globalStage: GlobalStageReturnDto;
}
