import { Inject, Injectable } from '@nestjs/common';
import { ThreadReturnDto } from './dtos/thread-return.dto';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';

@Injectable()
export class ThreadRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

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
    await this.db.query(query, [openAiThreadId, userId, templateId]);

    query = `
    SELECT
    id,
    openAiId,
    userId,
    templateId
    FROM threads
    WHERE openAiId = ?
   `;
    let [createdThread] = await this.db.query(query, [openAiThreadId]);
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

    const [theThread] = await this.db.query(query, [threadId]);

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

    const [theThread] = await this.db.query(query, [templateId, userId]);

    return theThread;
  }

  async finishTemplateThread(threadOpenaiId: string) {
    let query = `
    UPDATE threads
    SET
    finishTemplate = true
    WHERE openAiId = ?
    `;
    await this.db.query(query, [threadOpenaiId]);
  }
}
