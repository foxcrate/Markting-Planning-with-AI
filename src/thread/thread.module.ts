import { forwardRef, Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { ThreadRepository } from './thread.repository';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  controllers: [ThreadController],
  providers: [ThreadService, ThreadRepository],
  imports: [forwardRef(() => OpenAiModule)],
  exports: [ThreadRepository, ThreadService],
})
export class ThreadModule {}
