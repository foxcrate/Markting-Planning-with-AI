import { StageReturnDto } from './stage-return.dto';

export class FunnelReturnDto {
  id: number;
  name: string;
  description: number;
  userId: number;
  stages: StageReturnDto[];
}
