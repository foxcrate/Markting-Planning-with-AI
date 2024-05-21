import { IsOptional, IsString } from 'class-validator';

export class WorkspaceUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  goal: string;

  @IsString()
  @IsOptional()
  budget: string;

  @IsString()
  @IsOptional()
  targetGroup: string;

  @IsString()
  @IsOptional()
  marketingLevel: string;
}
