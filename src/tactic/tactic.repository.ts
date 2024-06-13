import { Inject, Injectable } from '@nestjs/common';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticStepCreateDto } from './dtos/tactic-step-create.dto';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { GetMineFilterDto } from './dtos/get-mine-filter.dto';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';

@Injectable()
export class TacticRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(
    tacticCreateBody: TacticCreateDto,
    userId: number,
  ): Promise<TacticReturnDto> {
    const query = `
    INSERT INTO tactics (name, description, kpiName, kpiUnit, kpiMeasuringFrequency,private,globalStageId,userId) VALUES (?,?,?,?,?,?,?,?)
  `;
    const params = [
      tacticCreateBody.name,
      tacticCreateBody.description,
      tacticCreateBody.kpiName ? tacticCreateBody.kpiName : null,
      tacticCreateBody.kpiUnit ? tacticCreateBody.kpiUnit : null,
      tacticCreateBody.kpiMeasuringFrequency
        ? tacticCreateBody.kpiMeasuringFrequency
        : null,
      tacticCreateBody.private ? tacticCreateBody.private : false,
      tacticCreateBody.globalStageId,
      userId,
    ];

    let { insertId } = await this.db.query(query, params);

    if (tacticCreateBody.steps && tacticCreateBody.steps.length > 0) {
      await this.addSteps(Number(insertId), tacticCreateBody.steps);
    }

    return await this.findById(Number(insertId));
  }

  async addSteps(tacticId: number, steps: TacticStepCreateDto[]) {
    let stepsArray = [];
    for (let i = 0; i < steps.length; i++) {
      stepsArray.push([
        tacticId,
        steps[i].name,
        steps[i].description,
        steps[i].theOrder,
      ]);
    }

    await this.db.batch(
      `INSERT INTO tactic_step (tacticId,name,description,theOrder) VALUES (?,?,?,?)`,
      stepsArray,
    );
  }

  async deletePastSteps(tacticId: number) {
    const query = `
      DELETE FROM tactic_step
      WHERE tacticId = ?
    `;
    await this.db.query(query, [tacticId]);
  }

  //create tactics
  async createTactics(tactics: any[], stageId: number) {
    try {
      for (let i = 0; i < tactics.length; i++) {
        tactics[i].stageId = stageId;
        tactics[i].globalStageId = null;
        tactics[i].kpiName = null;
        tactics[i].kpiUnit = null;
        tactics[i].kpiMeasuringFrequency = null;
        await this.create(tactics[i], null);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }

    return true;
  }

  async getTacticsByUserId(userId: number, filterOptions: GetMineFilterDto) {
    const queryStart = `
    WITH
    this_tactics_stages AS (
      SELECT tactics_stages.tacticId,
      CASE WHEN COUNT(tactics_stages.stageId) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', stages.id,
        'name', stages.name,
        'description', stages.description,
        'theOrder', stages.theOrder
        ))
      END AS stages
      FROM tactics_stages
      JOIN stages ON tactics_stages.stageId = stages.id
      GROUP BY tactics_stages.tacticId
    )
    SELECT tactics.id,
    tactics.name,
    tactics.description,
    tactics.kpiName,
    tactics.kpiUnit,
    tactics.kpiMeasuringFrequency,
    tactics.private,
    tactics.userId,
    CASE WHEN COUNT(users.id) = 0 THEN null
    ELSE
    JSON_OBJECT(
      'id',users.id,
      'firstName', users.firstName,
      'lastName', users.lastName,
      'profilePicture', users.profilePicture
    )
    END AS user,
    CASE WHEN COUNT(global_stages.id) = 0 THEN null
    ELSE
    JSON_OBJECT(
      'id',global_stages.id,
      'name', global_stages.name,
      'description', global_stages.description
    )
    END AS globalStage,
    CASE WHEN COUNT(tactic_step.id) = 0 THEN null
    ELSE
    JSON_ARRAYAGG(JSON_OBJECT(
      'id',tactic_step.id,
      'name', tactic_step.name,
      'description', tactic_step.description,
      'attachment', tactic_step.attachment,
      'theOrder', tactic_step.theOrder
      ))
    END AS steps,

    (
      SELECT
      stages
      FROM
      this_tactics_stages
      where this_tactics_stages.tacticId = tactics.id
    )
    AS stages

    FROM tactics
    LEFT JOIN global_stages ON global_stages.id = tactics.globalStageId
    LEFT JOIN tactic_step ON tactic_step.tacticId = tactics.id
    LEFT JOIN users ON users.id = tactics.userId
    WHERE tactics.userId = ?
    
  `;
    let filter = ``;
    if (filterOptions.private) {
      filter = filter + ` AND tactics.private = ${filterOptions.private} `;
    }
    if (filterOptions.name) {
      filter = filter + ` AND tactics.name LIKE '%${filterOptions.name}%' `;
    }

    if (filterOptions.globalStage) {
      filter =
        filter + ` AND global_stages.name = '${filterOptions.globalStage}' `;
    }
    let queryEnd = `GROUP BY tactics.id`;

    return await this.db.query(queryStart + filter + queryEnd, [userId]);
  }

  //update global_stage
  async update(
    updateBody: TacticUpdateDto,
    tacticId: number,
  ): Promise<TacticReturnDto> {
    // updateBody.stages[0].
    const query = `
      UPDATE tactics
      SET
      name = IFNULL(?,tactics.name),
      description = IFNULL(?,tactics.description),
      kpiName = IFNULL(?,tactics.kpiName),
      kpiUnit = IFNULL(?,tactics.kpiUnit),
      kpiMeasuringFrequency = IFNULL(?,tactics.kpiMeasuringFrequency),
      private = IFNULL(?,tactics.private),
      globalStageId = IFNULL(?,tactics.globalStageId)
      WHERE id = ?
    `;
    await this.db.query(query, [
      updateBody.name,
      updateBody.description,
      updateBody.kpiName,
      updateBody.kpiUnit,
      updateBody.kpiMeasuringFrequency,
      updateBody.private,
      updateBody.globalStageId,
      tacticId,
    ]);

    if (updateBody.steps.length == 0) {
      await this.deletePastSteps(tacticId);
    } else if (updateBody.steps && updateBody.steps.length > 0) {
      await this.deletePastSteps(tacticId);
      await this.addSteps(tacticId, updateBody.steps);
    }

    return await this.findById(tacticId);
  }

  async findById(id: number): Promise<TacticReturnDto> {
    const query = `
      SELECT tactics.id,
      tactics.name,
      tactics.description,
      tactics.kpiName,
      tactics.kpiUnit,
      tactics.kpiMeasuringFrequency,
      tactics.private,
      tactics.userId,
      CASE WHEN COUNT(users.id) = 0 THEN null
      ELSE
      JSON_OBJECT(
        'id',users.id,
        'firstName', users.firstName,
        'lastName', users.lastName,
        'profilePicture', users.profilePicture
      )
      END AS user,
      CASE WHEN COUNT(global_stages.id) = 0 THEN null
      ELSE
      JSON_OBJECT(
        'id',global_stages.id,
        'name', global_stages.name,
        'description', global_stages.description
      )
      END AS globalStage,
      CASE WHEN COUNT(tactic_step.id) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id',tactic_step.id,
        'name', tactic_step.name,
        'description', tactic_step.description,
        'attachment', tactic_step.attachment,
        'theOrder', tactic_step.theOrder
        ))
      END AS steps
      FROM tactics
      LEFT JOIN global_stages ON global_stages.id = tactics.globalStageId
      LEFT JOIN tactic_step ON tactic_step.tacticId = tactics.id
      LEFT JOIN users ON users.id = tactics.userId
      WHERE tactics.id = ?
      GROUP BY tactics.id;
    `;
    let [theTactic] = await this.db.query(query, [id, id]);

    return theTactic;
  }

  //find all tactics
  async findAll(filterOptions: GetAllFilterDto): Promise<TacticReturnDto[]> {
    const queryStart = `
    SELECT tactics.id,
    tactics.name,
    tactics.description,
    tactics.kpiName,
    tactics.kpiUnit,
    tactics.kpiMeasuringFrequency,
    tactics.private,
    tactics.userId,
    CASE WHEN COUNT(users.id) = 0 THEN null
    ELSE
    JSON_OBJECT(
      'id',users.id,
      'firstName', users.firstName,
      'lastName', users.lastName,
      'profilePicture', users.profilePicture
    )
    END AS user,
    CASE WHEN COUNT(global_stages.id) = 0 THEN null
    ELSE
    JSON_OBJECT(
      'id',global_stages.id,
      'name', global_stages.name,
      'description', global_stages.description
    )
    END AS globalStage,
    CASE WHEN COUNT(tactic_step.id) = 0 THEN null
    ELSE
    JSON_ARRAYAGG(JSON_OBJECT(
      'id',tactic_step.id,
      'name', tactic_step.name,
      'description', tactic_step.description,
      'attachment', tactic_step.attachment,
      'theOrder', tactic_step.theOrder
      ))
    END AS steps

    FROM tactics
    LEFT JOIN global_stages ON global_stages.id = tactics.globalStageId
    LEFT JOIN tactic_step ON tactic_step.tacticId = tactics.id
    LEFT JOIN users ON users.id = tactics.userId
    WHERE tactics.private = false
    
  `;
    let filter = ``;
    if (filterOptions.name) {
      filter = filter + ` AND tactics.name LIKE '%${filterOptions.name}%' `;
    }

    if (filterOptions.globalStage) {
      filter =
        filter + ` AND global_stages.name = '${filterOptions.globalStage}' `;
    }
    let queryEnd = `GROUP BY tactics.id`;

    return await this.db.query(queryStart + filter + queryEnd);
  }

  //delete global_stage
  async delete(id: number) {
    const query = `
      DELETE FROM tactics
      WHERE id = ?
    `;
    await this.db.query(query, [id]);
  }
}
