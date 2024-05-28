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
    return 'Hello To Crespo!';
  }
}
