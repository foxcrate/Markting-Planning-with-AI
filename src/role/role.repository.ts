import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { RoleReturnDto } from './dtos/role-return.dto';
import { RoleCreateDto } from './dtos/role-create.dto';
import { RoleUpdateDto } from './dtos/role-update.dto';

@Injectable()
export class RoleRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  async getAll(): Promise<RoleReturnDto[]> {
    const query = `
      SELECT
        roles.id,
        roles.name,
        JSON_EXTRACT(roles.permissions,'$') AS permissions
      FROM
        roles
    `;
    let roles = await this.db.query(query);

    return roles;
  }

  async create(reqBody: RoleCreateDto) {
    const query = `
    INSERT
    INTO
    roles
      (name, permissions)
    VALUES
        (?,?)
  `;

    let { insertId } = await this.db.query(query, [
      reqBody.name,
      JSON.stringify(reqBody.permissions),
    ]);

    return await this.findById(Number(insertId));
  }

  async findById(id: number): Promise<RoleReturnDto> {
    const query = `
    SELECT
        id,
        name,
        JSON_EXTRACT(roles.permissions,'$') AS permissions
    FROM
        roles
    WHERE
        id = ?
    `;
    let [theRole] = await this.db.query(query, [id]);

    return theRole;
  }

  async findByName(name: string): Promise<RoleReturnDto> {
    const query = `
    SELECT
        id,
        name,
        JSON_EXTRACT(roles.permissions,'$') AS permissions
    FROM
        roles
    WHERE
        name = ?
    `;
    let [theRole] = await this.db.query(query, [name]);

    return theRole;
  }

  async update(reqBody: RoleUpdateDto, id: number) {
    const query = `
      UPDATE
      roles
      SET
      name = IFNULL(?,roles.name),
      permissions = IFNULL(?,roles.permissions)
      WHERE id = ?
    `;
    await this.db.query(query, [
      reqBody.name,
      reqBody.permissions ? JSON.stringify(reqBody.permissions) : null,
      id,
    ]);
  }

  async deleteById(roleId: number): Promise<any> {
    const query = `
      DELETE
      FROM
      roles
      WHERE
        id = ?
    `;
    await this.db.query(query, [roleId]);
  }
}
