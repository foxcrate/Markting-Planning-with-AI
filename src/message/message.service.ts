import { Injectable } from '@nestjs/common';
import { MessageModel } from './message.model';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageModel: MessageModel,
    private readonly openAiService: OpenAiService,
  ) {}
  async sendMessage(message: string) {
    let threadId = 'thread_7EX7cPun5aqWXU8xDy67Mw8M';
    let aiResposne = this.openAiService.sendMessageReturnResponse(
      threadId,
      message,
    );

    return aiResposne;

    // return await this.messageModel.saveMessage(message);
    // const thread = await openai.beta.threads.create();
  }
}
