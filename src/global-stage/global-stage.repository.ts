import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GlobalStageCreateDto } from './dtos/global-stage-create.dto';
import { GlobalStageUpdateDto } from './dtos/global-stage-update.dto';
import { GlobalStageReturnDto } from './dtos/global-stage-return.dto';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';

@Injectable()
export class GlobalStageRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(
    globalStageCreateBody: GlobalStageCreateDto,
  ): Promise<GlobalStageReturnDto> {
    const { name, description, theOrder } = globalStageCreateBody;
    let repeatedGlobalStage = await this.findByName(name);
    if (repeatedGlobalStage) {
      throw new UnprocessableEntityException(
        'Global Stage name already exists',
      );
    }
    const query = `
      INSERT INTO global_stages (name, description,theOrder) VALUES (?, ?, ?)
    `;
    let { insertId } = await this.db.query(query, [
      name,
      description,
      theOrder,
    ]);

    return await this.findById(Number(insertId));
  }

  //update global_stage
  async update(
    updateBody: GlobalStageUpdateDto,
    globalStageId: number,
  ): Promise<GlobalStageReturnDto> {
    // updateBody.stages[0].
    const query = `
      UPDATE global_stages
      SET
      name = IFNULL(?,global_stages.name),
      description = IFNULL(?,global_stages.description),
      theOrder = IFNULL(?,global_stages.theOrder)
      WHERE id = ?
    `;
    await this.db.query(query, [
      updateBody.name,
      updateBody.description,
      updateBody.theOrder,
      globalStageId,
    ]);

    return await this.findById(globalStageId);
  }

  async findById(id: number): Promise<GlobalStageReturnDto> {
    const query = `
      SELECT global_stages.id, global_stages.name, global_stages.description,global_stages.theOrder
      FROM global_stages
      WHERE global_stages.id = ?
    `;
    let [theGlobalStage] = await this.db.query(query, [id]);
    return theGlobalStage;
  }

  //find all global_stages
  async findAll(): Promise<GlobalStageReturnDto[]> {
    const query = `
      SELECT global_stages.id, global_stages.name, global_stages.description,global_stages.theOrder
      FROM global_stages
    `;
    return await this.db.query(query, []);
  }

  async findByName(name: string): Promise<GlobalStageReturnDto> {
    const query = `
      SELECT id, name, description,theOrder
      FROM global_stages
      WHERE name = ?
    `;
    let [theGlobalStage] = await this.db.query(query, [name]);
    return theGlobalStage;
  }

  //delete global_stage
  async delete(id: number) {
    const query = `
      DELETE FROM global_stages
      WHERE id = ?
    `;
    await this.db.query(query, [id]);
  }
}
