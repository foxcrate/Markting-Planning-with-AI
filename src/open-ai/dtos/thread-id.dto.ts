import { IsNotEmpty } from 'class-validator';

export class ThreadIdDto {
  @IsNotEmpty()
  threadId: number;
}
