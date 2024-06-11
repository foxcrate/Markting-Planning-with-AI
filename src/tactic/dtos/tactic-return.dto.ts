import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticStepEntity } from '../tactic-step.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TacticReturnDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  benchmarkName: string;
  @ApiProperty()
  benchmarkNumber: string;
  @ApiProperty()
  private: boolean;
  @ApiProperty()
  userId: number;
  @ApiProperty({ type: TacticStepEntity, isArray: true })
  steps: TacticStepEntity[];
  @ApiProperty()
  globalStage: GlobalStageReturnDto;
}
