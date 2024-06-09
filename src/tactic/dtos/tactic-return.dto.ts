import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticStepEntity } from '../tactic-step.entity';

export class TacticReturnDto {
  id: number;
  name: string;
  description: number;
  benchmarkName: string;
  benchmarkNumber: string;
  private: boolean;
  userId: number;
  steps: TacticStepEntity[];
  globalStage: GlobalStageReturnDto;
}
