import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticStepCreateDto } from './dtos/tactic-step-create.dto';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';

@Injectable()
export class TacticRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(
    tacticCreateBody: TacticCreateDto,
    userId: number,
  ): Promise<TacticReturnDto> {
    const query = `
    INSERT INTO tactics (name, description, benchmarkName, benchmarkNumber, private,globalStageId,userId) VALUES (?,?,?,?, ?,?,?)
  `;
    const params = [
      tacticCreateBody.name,
      tacticCreateBody.description,
      tacticCreateBody.benchmarkName ? tacticCreateBody.benchmarkName : null,
      tacticCreateBody.benchmarkNumber
        ? tacticCreateBody.benchmarkNumber
        : null,
      tacticCreateBody.private ? tacticCreateBody.private : false,
      tacticCreateBody.globalStageId,
      userId,
    ];

    let { insertId } = await this.db.query(query, params);

    if (tacticCreateBody.steps && tacticCreateBody.steps.length > 0) {
      await this.addSteps(Number(insertId), tacticCreateBody.steps);
    }

    if (tacticCreateBody.stageId) {
      await this.addToStage(
        Number(insertId),
        parseInt(tacticCreateBody.stageId),
      );
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
        steps[i].order,
      ]);
    }

    await this.db.batch(
      `INSERT INTO tactic_step (tacticId,name,description,\`order\`) VALUES (?,?,?,?)`,
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

  async addToStage(tacticId: number, stageId: number) {
    // check if tactic_stage exists
    let query = `
      SELECT *
      FROM tactics_stages
      WHERE tacticId = ? AND stageId = ?
    `;
    const tactic_stage = await this.db.query(query, [tacticId, stageId]);
    if (tactic_stage.length == 0) {
      query = 'INSERT INTO tactics_stages (tacticId,stageId) VALUES (?,?)';

      await this.db.query(query, [tacticId, stageId]);
    }
  }

  //create tactics
  async createTactics(tactics: any[], stageId: number) {
    try {
      for (let i = 0; i < tactics.length; i++) {
        tactics[i].stageId = stageId;
        tactics[i].globalStageId = null;
        tactics[i].benchmarkName = null;
        tactics[i].benchmarkNumber = null;
        await this.create(tactics[i], null);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }

    return true;
  }

  async removeFromStage(tacticId: number, stageId: number) {
    const query =
      'DELETE FROM tactics_stages WHERE tacticId = ? AND stageId = ?';

    await this.db.query(query, [tacticId, stageId]);
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
      benchmarkName = IFNULL(?,tactics.benchmarkName),
      benchmarkNumber = IFNULL(?,tactics.benchmarkNumber),
      private = IFNULL(?,tactics.private),
      globalStageId = IFNULL(?,tactics.globalStageId)
      WHERE id = ?
    `;
    await this.db.query(query, [
      updateBody.name,
      updateBody.description,
      updateBody.benchmarkName,
      updateBody.benchmarkNumber,
      updateBody.private,
      updateBody.globalStageId,
      tacticId,
    ]);

    if (updateBody.steps && updateBody.steps.length > 0) {
      await this.addSteps(tacticId, updateBody.steps);
    }

    return await this.findById(tacticId);
  }

  async findById(id: number): Promise<TacticReturnDto> {
    const query = `
      WITH
      this_tactic_stages AS (
        SELECT 
        CASE WHEN COUNT(stages.id) = 0 THEN null
        ELSE
        JSON_ARRAYAGG(JSON_OBJECT(
          'id',stages.id,
          'name', stages.name,
          'description', stages.description,
          'order', stages.order
          ))
        END AS stages
        FROM tactics_stages
        JOIN stages ON tactics_stages.stageId = stages.id
        WHERE tacticId = ?
      )
      SELECT tactics.id,
      tactics.name,
      tactics.description,
      tactics.benchmarkName,
      tactics.benchmarkNumber,
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
      END AS global_stage,
      CASE WHEN COUNT(tactic_step.id) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id',tactic_step.id,
        'name', tactic_step.name,
        'description', tactic_step.description,
        'attachment', tactic_step.attachment,
        'order', tactic_step.order
        ))
      END AS steps,
      (
        SELECT stages FROM this_tactic_stages
      ) AS stages
      FROM tactics
      LEFT JOIN global_stages ON global_stages.id = tactics.globalStageId
      LEFT JOIN tactic_step ON tactic_step.tacticId = tactics.id
      LEFT JOIN users ON users.id = tactics.userId
      WHERE tactics.id = ?
    `;
    let [theTactic] = await this.db.query(query, [id, id]);
    return theTactic;
  }

  //find all tactics
  async findAll(name: string): Promise<TacticReturnDto[]> {
    const query = `
    WITH
    this_tactics_stages AS (
      SELECT tactics_stages.tacticId,
      CASE WHEN COUNT(tactics_stages.stageId) = 0 THEN null
      ELSE
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', stages.id,
        'name', stages.name,
        'description', stages.description,
        'order', stages.order
        ))
      END AS stages
      FROM tactics_stages
      JOIN stages ON tactics_stages.stageId = stages.id
      GROUP BY tactics_stages.tacticId
    )
    SELECT tactics.id,
    tactics.name,
    tactics.description,
    tactics.benchmarkName,
    tactics.benchmarkNumber,
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
    END AS global_stage,
    CASE WHEN COUNT(tactic_step.id) = 0 THEN null
    ELSE
    JSON_ARRAYAGG(JSON_OBJECT(
      'id',tactic_step.id,
      'name', tactic_step.name,
      'description', tactic_step.description,
      'attachment', tactic_step.attachment,
      'order', tactic_step.order
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
    WHERE tactics.private = false
    
  `;
    let search = ``;
    if (name) {
      search = `AND tactics.name LIKE '%${name}%'`;
    }
    let query2 = `GROUP BY tactics.id`;
    return await this.db.query(query + search + query2, []);
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
