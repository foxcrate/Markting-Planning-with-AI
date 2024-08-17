import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TacticKpiEntryCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ description: 'yyyy-mm-dd' })
  @IsNotEmpty()
  @IsString()
  date: String;
}
