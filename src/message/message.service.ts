import { Injectable } from '@nestjs/common';
import { MessageModel } from './message.model';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { UserModel } from 'src/user/user.model';
import { ThreadModel } from 'src/thread/thread.model';
import { SenderRole } from 'src/enums/sender-role.enum';
import { ThreadReturnDto } from 'src/thread/dtos/thread-return.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly threadModel: ThreadModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
    private readonly openAiService: OpenAiService,
  ) {}
  async sendMessage(message: string, threadId: number, userId: number) {
    let theThread = {} as ThreadReturnDto;
    if (!threadId) {
      let newThread = await this.threadModel.create(userId);
      theThread = newThread;
    }
    theThread = await this.threadModel.findById(threadId);

    //save user message
    await this.messageModel.create(message, theThread.id, SenderRole.USER);
    let aiResponse = await this.openAiService.sendMessageReturnResponse(
      theThread.openAiId,
      message,
    );

    await this.messageModel.create(
      aiResponse.message,
      theThread.id,
      SenderRole.OPEN_AI,
    );

    return aiResponse;
  }
}
