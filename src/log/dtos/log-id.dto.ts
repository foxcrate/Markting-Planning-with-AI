import { IsNotEmpty } from 'class-validator';

export class LogIdDto {
  @IsNotEmpty()
  logId: number;
}
