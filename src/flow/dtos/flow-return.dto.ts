import { ApiProperty } from '@nestjs/swagger';
import { FlowStepCreateDto } from './flow-step-create.dto';

export class FlowReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  // @ApiProperty({ type: FlowStepCreateDto, isArray: true })
  // steps: FlowStepCreateDto[];

  @ApiProperty()
  funnelId: number;

  // @ApiProperty()
  // userId: number;
}
