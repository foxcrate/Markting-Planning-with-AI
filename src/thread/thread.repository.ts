import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { EntityManager } from 'typeorm';
import { ThreadReturnDto } from './dtos/thread-return.dto';

@Injectable()
export class ThreadRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly openAiService: OpenAiService,
  ) {}

  async create(
    userId: number,
    templateId: number = null,
  ): Promise<ThreadReturnDto> {
    let openAiThread = await this.openAiService.createUserThread();

    let query = `
       INSERT INTO threads
       (openAiId, userId,templateId)
       values (?,?,?)
      `;
    await this.entityManager.query(query, [
      openAiThread.id,
      userId,
      templateId,
    ]);

    query = `
    SELECT
    id,
    openAiId,
    userId,
    templateId
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
      threads.userId,
      threads.templateId
    FROM threads
    WHERE threads.id = ?
  `;

    const [theThread] = await this.entityManager.query(query, [threadId]);

    return theThread;
  }

  async findByTemplateIdAndUserId(
    templateId,
    userId,
  ): Promise<ThreadReturnDto> {
    let query = `
    SELECT
      threads.id,
      threads.openAiId,
      threads.userId,
      threads.templateId
    FROM threads
    WHERE threads.templateId = ?
    AND threads.userId = ?
  `;

    const [theThread] = await this.entityManager.query(query, [
      templateId,
      userId,
    ]);

    return theThread;
  }
}
