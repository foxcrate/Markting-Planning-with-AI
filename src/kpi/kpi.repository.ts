import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { KpiReturnDto } from './dtos/return.dto';
import { TacticKpiEntryCreateDto } from 'src/tactic/dtos/tactic-kpi-entry-create.dto';
import { TacticKpiEntryUpdateDto } from 'src/tactic/dtos/tactic-kpi-entry-update.dto';
import { KpiEntryReturnDto } from './dtos/kpi-entry-return.dto';

@Injectable()
export class KpiRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  async findById(id: number): Promise<KpiReturnDto> {
    const query = `
      SELECT
      kpis.id,
      kpis.name,
      kpis.unit,
      kpis.kpiMeasuringFrequency,
      kpis.tacticId
      FROM kpis
      WHERE kpis.id = ?
    `;
    let [theKpi] = await this.db.query(query, [id]);

    // console.log(theKpi);

    return theKpi;
  }

  async findKpiEntryById(kpiEntryId: number): Promise<KpiEntryReturnDto> {
    const query = `
      SELECT
      kpi_entry.id,
      kpi_entry.value,
      kpi_entry.date,
      kpi_entry.kpiId
      FROM
      kpi_entry
      WHERE kpi_entry.id = ?
    `;
    let [theKpiEntry] = await this.db.query(query, [kpiEntryId]);

    // console.log(theKpi);

    return theKpiEntry;
  }

  async createKpiEntry(
    kpiId: number,
    tacticKpiEntryBody: TacticKpiEntryCreateDto,
  ): Promise<any> {
    const query = `
    INSERT INTO kpi_entry (value, date, kpiId) VALUES (?,?,?)
  `;
    const params = [tacticKpiEntryBody.value, tacticKpiEntryBody.date, kpiId];

    await this.db.query(query, params);
  }

  async updateKpiEntry(
    kpiEntryId: number,
    tacticKpiEntryBody: TacticKpiEntryUpdateDto,
  ): Promise<any> {
    const query = `
      UPDATE kpi_entry
      SET
      value = IFNULL(?,kpi_entry.value),
      date = IFNULL(?,kpi_entry.date)
      WHERE kpi_entry.id = ?
    `;
    await this.db.query(query, [
      tacticKpiEntryBody.value,
      tacticKpiEntryBody.date,
      kpiEntryId,
    ]);
  }

  async deleteKpiEntry(kpiEntryId: number): Promise<any> {
    const query = `
      DELETE FROM kpi_entry
      WHERE id = ?
    `;
    await this.db.query(query, [kpiEntryId]);
  }
}
