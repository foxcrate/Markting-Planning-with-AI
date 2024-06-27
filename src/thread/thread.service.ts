import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  async getOne(id: number, userId: number): Promise<ThreadReturnDto> {
    await this.isOwner(id, userId);
    return await this.threadRepository.findById(id);
  }

  async isOwner(threadId: number, userId: number) {
    const theThread = await this.threadRepository.findById(threadId);
    if (!theThread) {
      throw new UnprocessableEntityException('Thread not found');
    }
    if (theThread.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this thread');
    }
  }
}
