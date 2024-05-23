import { Module } from '@nestjs/common';
import { TacticService } from './tactic.service';
import { TacticController } from './tactic.controller';
import { TacticRepository } from './tactic.repository';

@Module({
  controllers: [TacticController],
  providers: [TacticService, TacticRepository],
  exports: [TacticService],
})
export class TacticModule {}
