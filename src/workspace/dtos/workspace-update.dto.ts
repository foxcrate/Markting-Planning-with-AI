import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class WorkspaceUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  goal: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  budget: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  targetGroup: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  marketingLevel: string;
}
