import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { ThreadRepository } from 'src/thread/thread.repository';
import { SenderRole } from 'src/enums/sender-role.enum';
import { ThreadReturnDto } from 'src/thread/dtos/thread-return.dto';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async sendMessage(message: string, threadId: number, userId: number) {
    // let theThread = {} as ThreadReturnDto;
    // if (!threadId) {
    //   let newThread = await this.threadRepository.create(userId);
    //   theThread = newThread;
    // }
    // theThread = await this.threadRepository.findById(threadId);
    // //save user message
    // await this.messageRepository.create(message, theThread.id, SenderRole.USER);
    // let aiResponse = await this.openAiService.sendMessageReturnResponse(
    //   theThread.openAiId,
    //   message,
    // );
    // await this.messageRepository.create(
    //   aiResponse.message,
    //   theThread.id,
    //   SenderRole.ASSISTANT,
    // );
    // return aiResponse;
  }

  async create(message: string, threadId: number, role: string) {
    return await this.messageRepository.create(message, threadId, role);
  }
}
