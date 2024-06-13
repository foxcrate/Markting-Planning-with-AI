import { Injectable } from '@nestjs/common';
import { ThreadRepository } from './thread.repository';
import { ThreadReturnDto } from './dtos/thread-return.dto';

@Injectable()
export class ThreadService {
  constructor(private readonly threadRepository: ThreadRepository) {}
  async finishTemplateThread(threadOpenaiId: string) {
    return await this.threadRepository.finishTemplateThread(threadOpenaiId);
  }

  async create(
    userId: number,
    templateId: number = null,
    openAiThreadId: string,
  ): Promise<ThreadReturnDto> {
    return await this.threadRepository.create(
      userId,
      templateId,
      openAiThreadId,
    );
  }
}
