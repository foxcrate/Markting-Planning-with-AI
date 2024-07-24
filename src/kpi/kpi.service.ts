import { Injectable } from '@nestjs/common';
import { KpiRepository } from './kpi.repository';
import { KpiReturnDto } from './dtos/return.dto';
import { TacticKpiEntryCreateDto } from 'src/tactic/dtos/tactic-kpi-entry-create.dto';
import { TacticKpiEntryUpdateDto } from 'src/tactic/dtos/tactic-kpi-entry-update.dto';
import { KpiEntryReturnDto } from './dtos/kpi-entry-return.dto';

@Injectable()
export class KpiService {
  constructor(private readonly kpiRepository: KpiRepository) {}

  //get one kpi
  async getOne(kpiId: number): Promise<KpiReturnDto> {
    return await this.kpiRepository.findById(kpiId);
  }

  async getOneKpiEntry(kpiEntryId: number): Promise<KpiEntryReturnDto> {
    return await this.kpiRepository.findKpiEntryById(kpiEntryId);
  }

  async createKpiEntry(
    kpiId: number,
    tacticKpiEntryBody: TacticKpiEntryCreateDto,
  ): Promise<KpiReturnDto> {
    await this.kpiRepository.createKpiEntry(kpiId, tacticKpiEntryBody);
    return await this.kpiRepository.findById(kpiId);
  }

  async updateKpiEntry(
    kpiEntryId: number,
    tacticKpiEntryBody: TacticKpiEntryUpdateDto,
  ): Promise<any> {
    await this.kpiRepository.updateKpiEntry(kpiEntryId, tacticKpiEntryBody);
  }

  async deleteKpiEntry(kpiEntryId: number): Promise<any> {
    await this.kpiRepository.deleteKpiEntry(kpiEntryId);
  }
}
