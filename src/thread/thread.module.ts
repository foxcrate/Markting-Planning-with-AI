import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { ThreadModel } from './thread.model';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  controllers: [ThreadController],
  providers: [ThreadService, ThreadModel],
  imports: [OpenAiModule],
  exports: [ThreadModel],
})
export class ThreadModule {}
