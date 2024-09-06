import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TacticStepExcelImportForAdminDto } from './tactic-step-excel-import-for-admin.dto';
import { KpiExcelImportDto } from './kpi-excel-import.dto';

export class TacticReturnForExcelDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  @ApiProperty({
    type: KpiExcelImportDto,
    isArray: true,
  })
  kpis: KpiExcelImportDto[];

  @ApiProperty({ type: TacticStepExcelImportForAdminDto, isArray: true })
  steps: TacticStepExcelImportForAdminDto[];

  @ApiProperty()
  globalStage: GlobalStageReturnDto;
}
