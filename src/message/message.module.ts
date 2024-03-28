import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageModel } from './message.model';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageModel],
  imports: [OpenAiModule],
})
export class MessageModule {}
