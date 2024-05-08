import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { UserModule } from 'src/user/user.module';
import { ThreadModule } from 'src/thread/thread.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  // imports: [UserModule, OpenAiModule, ThreadModule],
  exports: [MessageRepository],
})
export class MessageModule {}
