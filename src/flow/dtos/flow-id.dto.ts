import { IsNotEmpty } from 'class-validator';

export class FlowIdDto {
  @IsNotEmpty()
  flowId: number;
}
