import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FunnelCreateDto } from './dtos/funnel-create.dto';
import { FunnelReturnDto } from './dtos/funnel-return.dto';
import { FunnelUpdateDto } from '../funnel/dtos/funnel-update.dto';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';

@Injectable()
export class FunnelRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(funnelCreateBody: FunnelCreateDto, userId: number) {
    const { name, description } = funnelCreateBody;
    // let repeatedFunnel = await this.findByName(name);
    // if (repeatedFunnel) {
    //   throw new UnprocessableEntityException('funnel name already exists');
    // }
    const query = `
      INSERT INTO funnels (name, description, userId) VALUES (?, ?, ?)
    `;
    let { insertId } = await this.db.query(query, [name, description, userId]);

    return await this.findById(Number(insertId));
  }

  //update funnel
  async update(updateBody: FunnelUpdateDto, funnelId: number) {
    // updateBody.stages[0].
    const query = `
      UPDATE funnels
      SET
      name = IFNULL(?,funnels.name),
      description = IFNULL(?,funnels.description)
      WHERE id = ?
    `;
    await this.db.query(query, [
      updateBody.name,
      updateBody.description,
      funnelId,
    ]);

    return await this.findById(funnelId);
  }

  async findById(id: number): Promise<FunnelReturnDto> {
    const query = `
      SELECT
        funnels.id,funnels.name,funnels.description,funnels.userId,
        CASE WHEN COUNT(stages.id) = 0 THEN JSON_ARRAY()
        ELSE
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',stages.id,
            'name', stages.name,
            'description', stages.description,
            'theOrder', stages.theOrder,
            'tactics', (
              SELECT
                CASE WHEN COUNT(tactics.id) = 0 THEN JSON_ARRAY()
                ELSE
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'id',tactics.id,
                      'name', tactics.name,
                      'description', tactics.description,
                      'checked', tactics.checked,
                      'theOrder', tactics_stages.theOrder
                    )
                  )
                END
              FROM tactics_stages
              LEFT JOIN tactics ON tactics.id = tactics_stages.tacticId
              WHERE tactics_stages.stageId = stages.id
              )
          )
        )
        END AS stages
      FROM funnels
      LEFT JOIN stages ON stages.funnelId = funnels.id
      WHERE funnels.id = ?
      GROUP BY funnels.id
    `;
    let [theFunnel] = await this.db.query(query, [id]);
    return theFunnel;
  }

  //find all funnels
  async findAll(
    filterOptions: GetAllFilterDto,
    userId: number,
  ): Promise<FunnelReturnDto[]> {
    const queryStart = `
      SELECT funnels.id,funnels.name,funnels.description,funnels.userId,
      CASE WHEN COUNT(stages.id) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id',stages.id,
        'name', stages.name,
        'description', stages.description,
        'theOrder', stages.theOrder
        ))
      END AS stages
      FROM funnels
      LEFT JOIN stages ON stages.funnelId = funnels.id
      WHERE funnels.userId = ?
    `;
    // return await this.db.query(query, [userId]);

    let filter = ``;
    if (filterOptions.name) {
      filter = filter + ` AND funnels.name LIKE '%${filterOptions.name}%' `;
    }

    let queryEnd = `GROUP BY funnels.id`;

    // console.log(queryStart + filter + queryEnd);
    // console.log('---------------------------------');

    return await this.db.query(queryStart + filter + queryEnd, [userId]);
  }

  async findByName(name: string): Promise<FunnelReturnDto> {
    const query = `
      SELECT name,description,userId
      FROM funnels
      WHERE name = ?
    `;
    let [theFunnel] = await this.db.query(query, [name]);
    return theFunnel;
  }

  //delete funnel
  async delete(id: number) {
    const query = `
      DELETE FROM funnels
      WHERE id = ?
    `;
    await this.db.query(query, [id]);
  }
}
