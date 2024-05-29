import { Module } from '@nestjs/common';
import { GlobalStageController } from './global-stage.controller';
import { GlobalStageService } from './global-stage.service';
import { GlobalStageRepository } from './global-stage.repository';

@Module({
  controllers: [GlobalStageController],
  providers: [GlobalStageService, GlobalStageRepository],
  exports: [GlobalStageService],
})
export class GlobalStageModule {}
