import { ApiProperty } from '@nestjs/swagger';
import { StageTacticDto } from './stage-tactic.dto';

export class StageReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;

  @ApiProperty({ type: StageTacticDto, isArray: true })
  tactics: StageTacticDto[];

  @ApiProperty()
  funnelId: number;
}
