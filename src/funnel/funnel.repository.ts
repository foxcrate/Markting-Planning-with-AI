import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { FunnelCreateDto } from './dtos/funnel-create.dto';
import { FunnelReturnDto } from './dtos/funnel-return.dto';
import { StageCreateDto } from './dtos/stage-create.dto';
import { FunnelUpdateDto } from './dtos/funnel-update.dto';
import { StageReturnDto } from './dtos/stage-return.dto';

@Injectable()
export class FunnelRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(funnelCreateBody: FunnelCreateDto, userId: number) {
    const { name, description } = funnelCreateBody;
    let repeatedFunnel = await this.findByName(name);
    if (repeatedFunnel) {
      throw new UnprocessableEntityException('funnel name already exists');
    }
    const query = `
      INSERT INTO funnels (name, description, userId) VALUES (?, ?, ?)
    `;
    let { insertId } = await this.entityManager.query(query, [
      name,
      description,
      userId,
    ]);

    if (funnelCreateBody.stages && funnelCreateBody.stages.length > 0) {
      await this.addStages(insertId, funnelCreateBody.stages);
    }

    return await this.findById(insertId);
  }

  async addStages(funnelId: number, stages: StageCreateDto[]) {
    let stagesArray = [];
    for (let i = 0; i < stages.length; i++) {
      stagesArray.push([
        funnelId,
        stages[i].name,
        stages[i].order,
        stages[i].description,
      ]);
    }

    const query =
      'INSERT INTO stages (funnelId,name,`order`,description) VALUES ?';

    await this.entityManager.query(query, [stagesArray]);
  }

  async deletePastStages(funnelId: number) {
    const query = `
      DELETE FROM stages
      WHERE funnelId = ?
    `;
    await this.entityManager.query(query, [funnelId]);
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
    await this.entityManager.query(query, [
      updateBody.name,
      updateBody.description,
      funnelId,
    ]);

    if (updateBody.stages && updateBody.stages.length > 0) {
      await this.deletePastStages(funnelId);
      await this.addStages(funnelId, updateBody.stages);
    }
    return await this.findById(funnelId);
  }

  async findById(id: number): Promise<FunnelReturnDto> {
    const query = `
      SELECT funnels.id,funnels.name,funnels.description,funnels.userId,
      CASE WHEN COUNT(stages.id) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id',stages.id,
        'name', stages.name,
        'order', stages.order
        ))
      END AS stages
      FROM funnels
      LEFT JOIN stages ON stages.funnelId = funnels.id
      WHERE funnels.id = ?
      GROUP BY funnels.id
    `;
    let [theFunnel] = await this.entityManager.query(query, [id]);
    return theFunnel;
  }

  async findStageById(stageId: number): Promise<StageReturnDto> {
    const query = `
      SELECT stages.id,stages.name,stages.description,stages.funnelId,
      FROM stages
      WHERE stages.id = ?
    `;
    let [theStage] = await this.entityManager.query(query, [stageId]);
    return theStage;
  }

  //find all funnels
  async findAll(userId: number): Promise<FunnelReturnDto[]> {
    const query = `
      SELECT funnels.id,funnels.name,funnels.description,funnels.userId,
      CASE WHEN COUNT(stages.id) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id',stages.id,
        'name', stages.name,
        'order', stages.order
        ))
      END AS stages
      FROM funnels
      LEFT JOIN stages ON stages.funnelId = funnels.id
      WHERE funnels.userId = ?
      GROUP BY funnels.id
    `;
    return await this.entityManager.query(query, [userId]);
  }

  async findByName(name: string): Promise<FunnelReturnDto> {
    const query = `
      SELECT name,description,userId
      FROM funnels
      WHERE name = ?
    `;
    let [theFunnel] = await this.entityManager.query(query, [name]);
    return theFunnel;
  }

  async findUserAssistantFunnel(userId: number): Promise<FunnelReturnDto> {
    const query = `
      SELECT id,name,description,userId
      FROM funnels
      WHERE userId = ?
      AND createdByAssistant = true
    `;
    let [x] = await this.entityManager.query(query, [userId]);
    return x;
  }

  async createAssistantFunnel(
    funnelStagesObject: StageCreateDto[],
    userId: number,
  ) {
    const query = `
    INSERT INTO funnels (name, description, createdByAssistant, userId) VALUES (?, ?, ?, ?)
  `;
    let { insertId } = await this.entityManager.query(query, [
      'assistant funnel',
      'funnel created by assistant based on user workspace information',
      true,
      userId,
    ]);

    if (funnelStagesObject && funnelStagesObject.length > 0) {
      await this.addStages(insertId, funnelStagesObject);
    }

    return await this.findById(insertId);
  }

  async updateAssistantFunnel(
    funnelStagesObject: StageCreateDto[],
    userId: number,
  ) {
    let theAssistantFunnel = await this.findUserAssistantFunnel(userId);

    if (funnelStagesObject.length > 0) {
      await this.deletePastStages(theAssistantFunnel.id);
      await this.addStages(theAssistantFunnel.id, funnelStagesObject);
    }
    return await this.findById(theAssistantFunnel.id);
  }

  //delete funnel
  async delete(id: number) {
    const query = `
      DELETE FROM funnels
      WHERE id = ?
    `;
    await this.entityManager.query(query, [id]);
  }
}
