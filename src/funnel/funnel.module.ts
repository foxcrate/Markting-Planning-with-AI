import { Module } from '@nestjs/common';
import { FunnelController } from './funnel.controller';
import { FunnelService } from './funnel.service';
import { FunnelRepository } from './funnel.repository';

@Module({
  controllers: [FunnelController],
  providers: [FunnelService, FunnelRepository],
  exports: [FunnelService],
})
export class FunnelModule {}
