import { Module } from '@nestjs/common';
import { TacticService } from './tactic.service';
import { TacticController } from './tactic.controller';
import { TacticRepository } from './tactic.repository';
import { KpiModule } from 'src/kpi/kpi.module';
import { TacticAdminController } from './tactic-admin.controller';
import { GlobalStageModule } from 'src/global-stage/global-stage.module';

@Module({
  controllers: [TacticController, TacticAdminController],
  providers: [TacticService, TacticRepository],
  exports: [TacticService],
  imports: [KpiModule, GlobalStageModule],
})
export class TacticModule {}
