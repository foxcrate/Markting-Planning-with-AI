import { forwardRef, Module } from '@nestjs/common';
import { StageController } from './stage.controller';
import { StageService } from './stage.service';
import { StageRepository } from './stage.repository';
import { GlobalStageModule } from 'src/global-stage/global-stage.module';
import { FunnelModule } from 'src/funnel/funnel.module';
import { TacticModule } from 'src/tactic/tactic.module';

@Module({
  controllers: [StageController],
  providers: [StageService, StageRepository],
  exports: [StageService],
  imports: [GlobalStageModule, forwardRef(() => FunnelModule), TacticModule],
})
export class StageModule {}
