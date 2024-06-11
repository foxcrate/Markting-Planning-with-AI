import { ApiProperty } from '@nestjs/swagger';
import { StageTacticDto } from './stage-tactic.dto';

export class StageDetailsReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;

  @ApiProperty()
  funnelId: number;

  @ApiProperty({ type: StageTacticDto, isArray: true })
  tactics: StageTacticDto[];
}
