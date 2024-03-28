import { Injectable } from '@nestjs/common';
import { MessageModel } from './message.model';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { UserModel } from 'src/user/user.model';
import { ThreadModel } from 'src/thread/thread.model';
import { SenderRole } from 'src/enums/sender-role.enum';

@Injectable()
export class MessageService {
  constructor(
    private readonly threadModel: ThreadModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
    private readonly openAiService: OpenAiService,
  ) {}
  async sendMessage(message: string, userId: string) {
    let theUser = await this.userModel.findById(userId);

    let theThread = await this.threadModel.findById(theUser.threadId);

    //save user message
    await this.messageModel.create(message, theThread.id, SenderRole.USER);
    let aiResposne = await this.openAiService.sendMessageReturnResponse(
      theThread.openAiId,
      message,
    );

    await this.messageModel.create(
      aiResposne,
      theThread.id,
      SenderRole.OPEN_AI,
    );

    return aiResposne;
  }
}
