import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { LogCreateDto } from './dtos/log-create.dto';
import { LogReturnDto } from './dtos/log-return.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Injectable()
export class LogRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(reqBody: LogCreateDto, adminId: number) {
    const query = `
    INSERT
    INTO
    logs
      (entity,entityId,operation,adminId,oldObject,newObject,changesObject)
    VALUES
      (?,?,?,?,?,?,?)
  `;

    let { insertId } = await this.db.query(query, [
      reqBody.entity,
      reqBody.entityId,
      reqBody.operation,
      adminId,
      JSON.stringify(reqBody.oldObject),
      JSON.stringify(reqBody.newObject),
      JSON.stringify(reqBody.changesObject),
    ]);

    return await this.findById(Number(insertId));
  }

  async findById(id: number): Promise<LogReturnDto> {
    const query = `
    SELECT
        logs.id,
        logs.entity,
        logs.entityId,
        logs.operation,
        logs.adminId,
        JSON_OBJECT(
        'id',users.id,
        'firstName', users.firstName,
        'profilePicture', users.profilePicture
        ) AS admin,
        JSON_EXTRACT(logs.oldObject,'$') AS oldObject,
        JSON_EXTRACT(logs.newObject,'$') AS newObject,
        JSON_EXTRACT(logs.changesObject,'$') AS changesObject,
        logs.createdAt
    FROM
        logs
    LEFT JOIN users ON logs.adminId = users.id
    WHERE
        logs.id = ?
    `;
    let [log] = await this.db.query(query, [id]);
    return log;
  }

  async findAll(pagination: PaginationDto): Promise<LogReturnDto[]> {
    let queryParameters = [];
    const queryStart = `
    SELECT
        logs.id,
        logs.entity,
        logs.entityId,
        logs.operation,
        logs.adminId,
        JSON_OBJECT(
        'id',users.id,
        'firstName', users.firstName,
        'profilePicture', users.profilePicture
            ) AS admin,
        JSON_EXTRACT(logs.oldObject,'$') AS oldObject,
        JSON_EXTRACT(logs.newObject,'$') AS newObject,
        JSON_EXTRACT(logs.changesObject,'$') AS changesObject,
        logs.createdAt
    FROM
        logs
    LEFT JOIN users ON logs.adminId = users.id
    `;

    let paginationQuery = ``;
    if (pagination) {
      paginationQuery = `LIMIT ? OFFSET ?`;
      queryParameters = [pagination.limit, pagination.offset];
    }

    let logs = await this.db.query(
      queryStart + paginationQuery,
      queryParameters,
    );

    return logs;
  }
}
