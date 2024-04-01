import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FunnelIdDto {
  @IsNotEmpty()
  funnelId: number;
}
