import { TacticStepCreateDto } from './tactic-step-create.dto';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';

export class TacticDto {
  name?: string;

  description?: string;

  kpis?: KpiCreateDto[];

  private?: boolean;

  hidden?: boolean;

  globalStageId?: number;

  steps?: TacticStepCreateDto[];
}
