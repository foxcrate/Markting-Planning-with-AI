import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageModel } from './message.model';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { UserModule } from 'src/user/user.module';
import { ThreadModule } from 'src/thread/thread.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageModel],
  imports: [UserModule, OpenAiModule, ThreadModule],
})
export class MessageModule {}
