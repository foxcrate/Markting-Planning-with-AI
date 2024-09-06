import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GlobalStagesEnum } from 'src/enums/global-stages.enum';
import { KpiExcelImportDto } from 'src/tactic/dtos/admin/kpi-excel-import.dto';
import { TacticStepExcelImportForAdminDto } from './tactic-step-excel-import-for-admin.dto';

export class TacticExcelImportForAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: KpiExcelImportDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => KpiExcelImportDto)
  kpis: KpiExcelImportDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(GlobalStagesEnum)
  globalStageName: string;

  @ApiProperty({
    type: TacticStepExcelImportForAdminDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TacticStepExcelImportForAdminDto)
  steps: TacticStepExcelImportForAdminDto[];
}
