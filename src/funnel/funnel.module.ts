import { Module } from '@nestjs/common';
import { FunnelController } from './funnel.controller';
import { FunnelService } from './funnel.service';
import { FunnelModel } from './funnel.model';

@Module({
  controllers: [FunnelController],
  providers: [FunnelService, FunnelModel],
})
export class FunnelModule {}
