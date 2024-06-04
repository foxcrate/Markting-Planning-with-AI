import { Inject, Injectable } from '@nestjs/common';
import { MessageReturnDto } from './dtos/message-return.dto';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';

@Injectable()
export class MessageRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(message: string, threadId: number, role: string) {
    let query = `
       INSERT INTO messages
       (content, threadId, senderRole)
       values (?,?,?)
      `;
    let { insertId } = await this.db.query(query, [message, threadId, role]);

    query = `
      SELECT
      id,content,threadId,senderRole
      FROM messages
      WHERE id = ?
     `;
    let [createdMessage] = await this.db.query(query, [Number(insertId)]);
    return createdMessage;
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

    const [theMessage] = await this.db.query(query, [messageId]);

    return theMessage;
  }

  async getAllThreadMessages(threadId: number): Promise<MessageReturnDto[]> {
    let query = `
    SELECT
      messages.id,
      messages.content,
      messages.threadId,
      messages.senderRole
    FROM messages
    WHERE messages.threadId = ?
  `;
    const messages = await this.db.query(query, [threadId]);
    return messages;
  }
}
