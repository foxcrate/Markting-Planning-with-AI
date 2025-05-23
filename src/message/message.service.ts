import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageReturnDto } from 'src/message/dtos/message-return.dto';

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
    // await this.messageRepository.create(message, theThread.id, SenderRoleEnum.USER);
    // let aiResponse = await this.openAiService.sendMessageReturnResponse(
    //   theThread.openAiId,
    //   message,
    // );
    // await this.messageRepository.create(
    //   aiResponse.message,
    //   theThread.id,
    //   SenderRoleEnum.ASSISTANT,
    // );
    // return aiResponse;
  }

  async create(message: string, threadId: number, role: string) {
    return await this.messageRepository.create(message, threadId, role);
  }

  async getAllThreadMessages(threadId: number): Promise<MessageReturnDto[]> {
    return await this.messageRepository.getAllThreadMessages(threadId);
  }
}
