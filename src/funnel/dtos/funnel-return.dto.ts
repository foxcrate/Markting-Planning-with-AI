import { StageReturnDto } from '../../stage/dtos/stage-return.dto';

export class FunnelReturnDto {
  id: number;
  name: string;
  description: number;
  userId: number;
  stages: StageReturnDto[];
}
