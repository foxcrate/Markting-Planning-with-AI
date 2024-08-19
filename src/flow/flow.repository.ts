import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { FlowCreateDto } from './dtos/flow-create.dto';
import { FlowUpdateDto } from './dtos/flow-update.dto';
import { FlowReturnDto } from './dtos/flow-return.dto';
import { FlowDetailsReturnDto } from './dtos/flow-details-return.dto';

@Injectable()
export class FlowRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(createBody: FlowCreateDto, userId: number) {
    const query = `
        INSERT INTO flows (name,description,steps,funnelId,userId) VALUES (?,?,?,?,?)
      `;
    let { insertId } = await this.db.query(query, [
      createBody.name,
      createBody.description,
      JSON.stringify(createBody.steps),
      createBody.funnelId,
      userId,
    ]);

    return await this.findById(Number(insertId));
  }

  async update(updateBody: FlowUpdateDto, flowId: number) {
    const query = `
        UPDATE flows
        SET
        name = IFNULL(?,flows.name),
        description = IFNULL(?,flows.description),
        steps = IFNULL(?,flows.steps)
        WHERE id = ?
      `;
    await this.db.query(query, [
      updateBody.name,
      updateBody.description,
      updateBody.steps ? JSON.stringify(updateBody.steps) : null,
      flowId,
    ]);

    return await this.findById(flowId);
  }

  async findById(id: number): Promise<FlowDetailsReturnDto> {
    const query = `
        SELECT
          flows.id as id,
          flows.name as name,
          flows.description as description,
          flows.funnelId as funnelId,
          flows.userId as userId,
          JSON_EXTRACT(flows.steps,'$[*]') AS steps,
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
              users.id = flows.userId
          ) AS user,
          CASE WHEN COUNT(comments.id) = 0 THEN null
              ELSE
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id',comments.id,
                    'content', comments.content,
                    'createdAt', comments.createdAt,
                    'user',  (
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
                    )
                  )
                )
          END AS comments
        FROM
          flows
        LEFT JOIN
          comments ON flows.id = comments.flowId
        WHERE
          flows.id = ?
        HAVING flows.id IS NOT NULL; 
      `;
    let [theFlow] = await this.db.query(query, [id]);
    return theFlow;
  }

  async findByFunnel(funnelId: number): Promise<FlowReturnDto[]> {
    const query = `
          SELECT
            flows.id,
            flows.name,
            flows.description,
            flows.funnelId
        FROM
            flows
        WHERE
            funnelId = ?
      `;
    let theFlows = await this.db.query(query, [funnelId]);
    return theFlows;
  }

  //delete flow
  async delete(id: number) {
    const query = `
        DELETE FROM flows
        WHERE id = ?
      `;
    await this.db.query(query, [id]);
  }
}
