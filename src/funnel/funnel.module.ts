import { Module } from '@nestjs/common';
import { FunnelController } from './funnel.controller';
import { FunnelService } from './funnel.service';
import { FunnelRepository } from './funnel.repository';
import { GlobalStageModule } from 'src/global-stage/global-stage.module';

@Module({
  controllers: [FunnelController],
  providers: [FunnelService, FunnelRepository],
  exports: [FunnelService],
  imports: [GlobalStageModule],
})
export class FunnelModule {}
