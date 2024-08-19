import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { CommentCreateDto } from './dtos/comment-create.dto';
import { CommentUpdateDto } from './dtos/comment-update.dto';
import { CommentReturnDto } from './dtos/comment-return.dto';

@Injectable()
export class CommentRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(createBody: CommentCreateDto, flowId: number, userId: number) {
    const query = `
        INSERT INTO comments (content, flowId, userId) VALUES (?, ?, ?)
      `;
    let { insertId } = await this.db.query(query, [
      createBody.content,
      flowId,
      userId,
    ]);

    return await this.findById(Number(insertId));
  }

  async update(updateBody: CommentUpdateDto, commentId: number) {
    const query = `
        UPDATE comments
        SET
        content = IFNULL(?,comments.content)
        WHERE id = ?
      `;
    await this.db.query(query, [updateBody.content, commentId]);

    return await this.findById(commentId);
  }

  async findById(id: number): Promise<CommentReturnDto> {
    const query = `
        SELECT
          comments.id,
          comments.content,
          comments.flowId,
          comments.createdAt,
          comments.userId,
        (
          SELECT
          JSON_OBJECT(
            'id',users.id,
            'firstName', users.firstName,
            'profilePicture', users.profilePicture
          ) AS user
          FROM
            users
          WHERE
            users.id = comments.userId
        ) AS user
        FROM
        comments
        WHERE
        id = ?
      `;
    let [theComment] = await this.db.query(query, [id]);
    return theComment;
  }

  async findByFlow(flowId: number): Promise<CommentReturnDto[]> {
    const query = `
        SELECT
          comments.id,
          comments.content,
          comments.flowId,
          comments.createdAt,
          comments.userId,
          (
            SELECT
              users.id,
              users.firstName,
              users.profilePicture
            FROM
              users
            WHERE
              users.id = comments.userId
            LIMIT 1
          ) AS user
        FROM comments
        WHERE flowId = ?
      `;
    let theComments = await this.db.query(query, [flowId]);
    return theComments;
  }

  //delete comment
  async delete(id: number) {
    const query = `
        DELETE FROM comments
        WHERE id = ?
      `;
    await this.db.query(query, [id]);
  }
}
