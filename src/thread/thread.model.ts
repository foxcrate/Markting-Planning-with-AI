import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { EntityManager } from 'typeorm';
import { ThreadReturnDto } from './dtos/thread-return.dto';

@Injectable()
export class ThreadModel {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly openAiService: OpenAiService,
  ) {}

  async create(userId: number): Promise<ThreadReturnDto> {
    let openAiThread = await this.openAiService.createUserThread();

    let query = `
       INSERT INTO threads
       (openAiId, userId)
       values (?,?)
      `;
    await this.entityManager.query(query, [openAiThread.id, userId]);

    query = `
    SELECT
    id,
    openAiId,
    userId
    FROM threads
    WHERE openAiId = ?
   `;
    let [createdThread] = await this.entityManager.query(query, [
      openAiThread.id,
    ]);
    return createdThread;
  }

  async findById(threadId): Promise<ThreadReturnDto> {
    let query = `
    SELECT
      threads.id,
      threads.openAiId,
      threads.userId
    FROM threads
    WHERE threads.id = ?
  `;

    const [theThread] = await this.entityManager.query(query, [threadId]);

    return theThread;
  }
}
