import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class MessageModel {
  constructor(private readonly entityManager: EntityManager) {}

  async saveMessage(message) {
    // const query = `
    //     SELECT * FROM users
    //     WHERE (email = ? OR google_id = ?)
    //   `;
    // return this.entityManager.query(query, [email]);
    return message;
  }
}
