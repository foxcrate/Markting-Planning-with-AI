import { ApiProperty } from '@nestjs/swagger';
import { StageDetailsReturnDto } from 'src/stage/dtos/stage-details-return.dto';

export class FunnelDetailsReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: StageDetailsReturnDto, isArray: true })
  stages: StageDetailsReturnDto[];
}
