import { ApiProperty } from '@nestjs/swagger';
import { AiCreatedTacticStepDto } from './ai-created-tactic-step.dto';
import { KpiReturnDto } from 'src/kpi/dtos/return.dto';

export class AiCreatedTacticDto {
  @ApiProperty()
  prompt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stageName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;

  @ApiProperty({
    type: KpiReturnDto,
    isArray: true,
  })
  kpis: KpiReturnDto[];

  @ApiProperty({ type: AiCreatedTacticStepDto, isArray: true })
  steps: AiCreatedTacticStepDto[];
}
