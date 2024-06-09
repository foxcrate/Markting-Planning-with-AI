import { IsOptional, IsString } from 'class-validator';

export class FunnelUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
