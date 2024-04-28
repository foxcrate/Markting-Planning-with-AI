import { Injectable } from '@nestjs/common';
import { ThreadRepository } from './thread/thread.repository';
import { MessageRepository } from './message/message.repository';
import { OpenAiService } from './open-ai/open-ai.service';

@Injectable()
export class AppService {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly messageRepository: MessageRepository,
    private readonly openAiService: OpenAiService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async test(message: string): Promise<any> {
    // return await this.threadRepository.create(17);
    // return await this.openAiService.run(123);
    return await this.openAiService.saveMessageToThread(message, 123);
    // -----------
    // await this.openAiService.sendFirstAiMessage(
    //   'what is your project name?',
    //   106,
    // );
    // return true;
    // return await this.openAiService.saveMessageToThread(message, 106);
    // -----------
    return await this.openAiService.summarize(106);
    // return await this.openAiService.inThreadSummarization(106);
    // return 'alo';
  }
}
