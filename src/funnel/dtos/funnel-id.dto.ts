import { IsNotEmpty } from 'class-validator';

export class FunnelIdDto {
  @IsNotEmpty()
  funnelId: number;
}
