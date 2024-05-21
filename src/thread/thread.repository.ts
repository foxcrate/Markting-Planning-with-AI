import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ThreadReturnDto } from './dtos/thread-return.dto';

@Injectable()
export class ThreadRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(
    userId: number,
    templateId: number = null,
    openAiThreadId: string,
  ): Promise<ThreadReturnDto> {
    let query = `
       INSERT INTO threads
       (openAiId, userId,templateId)
       values (?,?,?)
      `;
    await this.entityManager.query(query, [openAiThreadId, userId, templateId]);

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
      openAiThreadId,
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

  async findActiveByTemplateIdAndUserId(
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
    AND threads.finishTemplate = false
  `;

    const [theThread] = await this.entityManager.query(query, [
      templateId,
      userId,
    ]);

    return theThread;
  }

  async finishTemplateThread(threadOpenaiId: string) {
    let query = `
    UPDATE threads
    SET
    finishTemplate = true
    WHERE openAiId = ?
    `;
    await this.entityManager.query(query, [threadOpenaiId]);
  }
}
