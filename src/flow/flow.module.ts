import { Module } from '@nestjs/common';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
import { FunnelModule } from 'src/funnel/funnel.module';
import { FlowRepository } from './flow.repository';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  controllers: [FlowController],
  providers: [FlowService, FlowRepository],
  exports: [FlowService],
  imports: [FunnelModule, CommentModule],
})
export class FlowModule {}
