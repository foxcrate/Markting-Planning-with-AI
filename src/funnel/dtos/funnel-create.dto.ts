import { IsNotEmpty, IsString } from 'class-validator';

export class FunnelCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
