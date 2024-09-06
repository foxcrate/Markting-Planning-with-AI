import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TacticStepExcelImportForAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  attachment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  theOrder: number;
}
