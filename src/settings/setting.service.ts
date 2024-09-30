import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SettingRepository } from './setting.repository';
import { SettingUpdateDto } from './dtos/setting-update.dto';
import { SettingReturnDto } from './dtos/setting-return.dto';
import { SettingsEnum } from 'src/enums/settings.enum';

@Injectable()
export class SettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  async update(updateBody: SettingUpdateDto, settingId: number) {
    let theSetting = await this.getOne(settingId);
    await this.settingRepository.update(updateBody, theSetting.id);
    return await this.settingRepository.findById(theSetting.id);
  }

  async getOne(settingId: number): Promise<SettingReturnDto> {
    let setting = await this.settingRepository.findById(settingId);
    if (!setting) {
      throw new UnprocessableEntityException('Setting not found');
    }
    return setting;
  }

  async getOneByName(settingName: SettingsEnum): Promise<SettingReturnDto> {
    let setting = await this.settingRepository.findByName(settingName);
    if (!setting) {
      throw new UnprocessableEntityException('Setting not found');
    }
    return setting;
  }

  async getAll(userId: number) {
    return await this.settingRepository.findAll();
  }
}
