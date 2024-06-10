import { ApiProperty } from '@nestjs/swagger';
import { StageReturnDto } from '../../stage/dtos/stage-return.dto';

export class FunnelReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: StageReturnDto, isArray: true })
  stages: StageReturnDto[];
}
