import { Module } from '@nestjs/common';
import { OpenAiController } from './open-ai.controller';
import { OpenAiService } from './open-ai.service';
import { MessageModule } from 'src/message/message.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  exports: [OpenAiService],
  imports: [MessageModule, WorkspaceModule],
})
export class OpenAiModule {}
