import { forwardRef, Module } from '@nestjs/common';
import { FunnelController } from './funnel.controller';
import { FunnelService } from './funnel.service';
import { FunnelRepository } from './funnel.repository';
import { GlobalStageModule } from 'src/global-stage/global-stage.module';
import { StageModule } from 'src/stage/stage.module';

@Module({
  controllers: [FunnelController],
  providers: [FunnelService, FunnelRepository],
  exports: [FunnelService],
  imports: [GlobalStageModule, forwardRef(() => StageModule)],
})
export class FunnelModule {}
