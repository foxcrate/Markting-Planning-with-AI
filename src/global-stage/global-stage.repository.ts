import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GlobalStageCreateDto } from './dtos/global-stage-create.dto';
import { GlobalStageUpdateDto } from './dtos/global-stage-update.dto';
import { GlobalStageReturnDto } from './dtos/global-stage-return.dto';

@Injectable()
export class GlobalStageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(
    globalStageCreateBody: GlobalStageCreateDto,
  ): Promise<GlobalStageReturnDto> {
    const { name, description } = globalStageCreateBody;
    let repeatedGlobalStage = await this.findByName(name);
    if (repeatedGlobalStage) {
      throw new UnprocessableEntityException(
        'Global Stage name already exists',
      );
    }
    const query = `
      INSERT INTO global_stages (name, description) VALUES (?, ?)
    `;
    let { insertId } = await this.entityManager.query(query, [
      name,
      description,
    ]);

    return await this.findById(insertId);
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
      description = IFNULL(?,global_stages.description)
      WHERE id = ?
    `;
    await this.entityManager.query(query, [
      updateBody.name,
      updateBody.description,
      globalStageId,
    ]);

    return await this.findById(globalStageId);
  }

  async findById(id: number): Promise<GlobalStageReturnDto> {
    const query = `
      SELECT global_stages.id, global_stages.name, global_stages.description
      FROM global_stages
      WHERE global_stages.id = ?
    `;
    let [theGlobalStage] = await this.entityManager.query(query, [id]);
    return theGlobalStage;
  }

  //find all global_stages
  async findAll(): Promise<GlobalStageReturnDto[]> {
    const query = `
      SELECT global_stages.id, global_stages.name, global_stages.description
      FROM global_stages
    `;
    return await this.entityManager.query(query, []);
  }

  async findByName(name: string): Promise<GlobalStageReturnDto> {
    const query = `
      SELECT id, name, description
      FROM global_stages
      WHERE name = ?
    `;
    let [theGlobalStage] = await this.entityManager.query(query, [name]);
    return theGlobalStage;
  }

  //delete global_stage
  async delete(id: number) {
    const query = `
      DELETE FROM global_stages
      WHERE id = ?
    `;
    await this.entityManager.query(query, [id]);
  }
}
