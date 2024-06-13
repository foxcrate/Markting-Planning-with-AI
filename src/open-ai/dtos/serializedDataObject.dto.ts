import { StageTacticDto } from 'src/stage/dtos/stage-tactic.dto';

export class SerializedDataObjectDto {
  project_data: {
    name: string;
    goal: string;
    budget: string;
    targetGroup: string;
    marketingLevel: string;
  };
  funnel_data: {
    name: string;
    description: string;
  };
  stage_data: {
    name: string;
    description: string;
    stage_tactics: StageTacticDto[];
  };
}
