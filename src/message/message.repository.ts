import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MessageReturnDto } from './dtos/message-return.dto';

@Injectable()
export class MessageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(
    message: string,
    threadId: number,
    role: string,
    templateFlowStepNumber: number = null,
  ) {
    let query = `
       INSERT INTO messages
       (content, threadId, senderRole,templateFlowStepNumber)
       values (?,?,?,?)
      `;
    let { insertId } = await this.entityManager.query(query, [
      message,
      threadId,
      role,
      templateFlowStepNumber,
    ]);

    query = `
      SELECT
      id,content,threadId,senderRole,templateFlowStepNumber
      FROM messages
      WHERE id = ?
     `;
    let [createdMessage] = await this.entityManager.query(query, [insertId]);
    return createdMessage;
  }

  async findById(messageId): Promise<MessageReturnDto> {
    let query = `
    SELECT
      messages.id,
      messages.content,
      messages.threadId,
      messages.senderRole,
      messages.templateFlowStepNumber
    FROM messages
    WHERE messages.id = ?
  `;

    const [theMessage] = await this.entityManager.query(query, [messageId]);

    return theMessage;
  }

  async getAllThreadMessages(threadId: number): Promise<MessageReturnDto[]> {
    let query = `
    SELECT
      messages.id,
      messages.content,
      messages.threadId,
      messages.senderRole,
      messages.templateFlowStepNumber
    FROM messages
    WHERE messages.threadId = ?
  `;
    const messages = await this.entityManager.query(query, [threadId]);
    return messages;
  }
}
