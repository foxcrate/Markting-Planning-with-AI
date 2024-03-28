import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MessageReturnDto } from './dtos/message-return.dto';

@Injectable()
export class MessageModel {
  constructor(private readonly entityManager: EntityManager) {}

  async create(message: string, threadId: number, role: string) {
    const query = `
       INSERT INTO messages
       (content, threadId, senderRole)
       values (?,?,?)
      `;
    await this.entityManager.query(query, [message, threadId, role]);

    //   query = `
    //   SELECT
    //   id,content,threadId,senderRole
    //   FROM messages
    //   WHERE content = ? AND threadId = ? AND senderRole = ?
    //  `;
    //   let [createdMessage] = await this.entityManager.query(query, [
    //     message,
    //     threadId,
    //     role,
    //   ]);
    //   return createdMessage;
  }

  async findById(messageId): Promise<MessageReturnDto> {
    let query = `
    SELECT
      messages.id,
      messages.content,
      messages.threadId,
      messages.senderRole
    FROM messages
    WHERE messages.id = ?
  `;

    const [theMessage] = await this.entityManager.query(query, [messageId]);

    return theMessage;
  }
}
