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

  async create(): Promise<ThreadReturnDto> {
    let openAiThread = await this.openAiService.createUserThread();

    let query = `
       INSERT INTO threads
       (openAiId)
       values (?)
      `;
    await this.entityManager.query(query, [openAiThread.id]);

    query = `
    SELECT
    id,openAiId
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
      threads.openAiId
    FROM threads
    WHERE threads.id = ?
  `;

    const [theThread] = await this.entityManager.query(query, [threadId]);

    return theThread;
  }
}
