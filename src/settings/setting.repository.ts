import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { SettingUpdateDto } from './dtos/setting-update.dto';
import { SettingReturnDto } from './dtos/setting-return.dto';

@Injectable()
export class SettingRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  //update funnel
  async update(updateBody: SettingUpdateDto, settingId: number) {
    // updateBody.stages[0].
    const query = `
        UPDATE settings
        SET
        value = IFNULL(?,settings.value)
        WHERE id = ?
      `;
    await this.db.query(query, [updateBody.value, settingId]);

    return await this.findById(settingId);
  }

  async findById(id: number): Promise<SettingReturnDto> {
    const query = `
        SELECT
          settings.id,
          settings.name,
          settings.value
        FROM settings
        WHERE settings.id = ?
      `;
    let [theSetting] = await this.db.query(query, [id]);
    return theSetting;
  }

  async findByName(name: string): Promise<SettingReturnDto> {
    // console.log('name in repo:', name);

    const query = `
        SELECT
          settings.id,
          settings.name,
          settings.value
        FROM settings
        WHERE settings.name = ?
      `;
    let [theSetting] = await this.db.query(query, [name]);
    return theSetting;
  }

  //find all settings
  async findAll(): Promise<SettingReturnDto[]> {
    const queryStart = `
        SELECT
          settings.id,
          settings.name,
          settings.value
        FROM settings
      `;

    let filter = ``;

    let queryEnd = ``;

    return await this.db.query(queryStart + filter + queryEnd);
  }
}
