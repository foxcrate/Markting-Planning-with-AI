import { Global, Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { SettingRepository } from './setting.repository';

@Global()
@Module({
  providers: [SettingService, SettingRepository],
  controllers: [SettingController],
  exports: [SettingService],
})
export class SettingModule {}
