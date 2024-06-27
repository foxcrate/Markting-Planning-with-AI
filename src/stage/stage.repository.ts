import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticIdAndOrderDto } from './dtos/tacticId-and-order.dto';
import { StageDetailsReturnDto } from './dtos/stage-details-return.dto';
import { StageTacticWithStepsReturnDto } from './dtos/stage-tactic-with-steps-return.dto';

@Injectable()
export class StageRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async findById(id: number): Promise<StageDetailsReturnDto> {
    const query = `
    SELECT
    stages.id,
    stages.name,
    stages.description,
    stages.theOrder,
    stages.funnelId,
    CASE WHEN COUNT(tactics_stages.id) = 0 THEN JSON_ARRAY()
    ELSE
    JSON_ARRAYAGG(
      JSON_OBJECT(
          'id', tactics.id,
          'name', tactics.name,
          'description', tactics.description,
          'checked', tactics.checked,
          'theOrder', tactics_stages.theOrder
      )
    )
    END AS tactics
    FROM stages
    LEFT JOIN tactics_stages ON stages.id = tactics_stages.stageId
    LEFT JOIN tactics ON tactics_stages.tacticId = tactics.id
    WHERE stages.id = ?
    GROUP BY stages.id
    `;

    let [theStage] = await this.db.query(query, [id]);

    // // sort stage's tactics by order
    // theStage.tactics.sort((a, b) => {
    //   return a.theOrder - b.theOrder;
    // });

    return theStage;
  }

  async findStageTacticById(
    id: number,
  ): Promise<StageTacticWithStepsReturnDto> {
    const query = `
      SELECT
      tactics.id,
      tactics.name,
      tactics.description,
      tactics.kpiName,
      tactics.kpiUnit,
      tactics.kpiMeasuringFrequency,
      tactics.kpiValue,
      tactics.checked,
      tactics.userId,
      (
        SELECT theOrder
        FROM tactics_stages
        WHERE tacticId = tactics.id
      )AS theOrder,
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
        'checked', tactic_step.checked,
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

    let [theStageTactic] = await this.db.query(query, [id]);

    // // sort stage's tactics by order
    // theStage.tactics.sort((a, b) => {
    //   return a.theOrder - b.theOrder;
    // });

    return theStageTactic;
  }

  async addStagesToFunnel(
    funnelId: number,
    globalStages: GlobalStageReturnDto[],
  ) {
    let stagesArray = [];
    for (let i = 0; i < globalStages.length; i++) {
      stagesArray.push([
        funnelId,
        globalStages[i].name,
        globalStages[i].description,
        globalStages[i].theOrder,
      ]);
    }

    await this.db.batch(
      `INSERT INTO stages (funnelId,name,description,theOrder) VALUES (?,?,?,?)`,
      stagesArray,
    );
  }

  async isOwner(stageId: number, funnelUserId: number, userId: number) {
    let stage = await this.findById(stageId);
    if (!stage) {
      throw new UnprocessableEntityException('Stage not found');
    }

    if (funnelUserId !== userId) {
      return false;
    }
    return true;
  }

  async addTacticToStage(stageId: number, tacticId: number, theOrder: number) {
    // check if tactic_stage exists
    let query = `
      SELECT *
      FROM tactics_stages
      WHERE tacticId = ? AND stageId = ?
    `;
    const tactic_stage = await this.db.query(query, [tacticId, stageId]);
    if (tactic_stage.length == 0) {
      query =
        'INSERT INTO tactics_stages (tacticId,stageId,theOrder) VALUES (?,?,?)';

      await this.db.query(query, [tacticId, stageId, theOrder]);
    }
  }

  async removeTacticFromStage(tacticId: number, stageId: number) {
    const query =
      'DELETE FROM tactics_stages WHERE tacticId = ? AND stageId = ?';

    await this.db.query(query, [tacticId, stageId]);
  }

  async getAllStageTacticsIds(stageId: number): Promise<number[]> {
    let [stageTacticsIds] = await this.db.query(
      `
      SELECT
      CASE WHEN COUNT(tactics_stages.id) = 0 THEN JSON_ARRAY()
      ELSE
      JSON_ARRAYAGG(tacticId)
      END AS tacticIds
      FROM
      tactics_stages
      WHERE stageId = ?
      `,
      [stageId],
    );
    return stageTacticsIds.tacticIds;
  }

  async updateStageTacticsOrder(
    stageId: number,
    tacticsAndOrders: TacticIdAndOrderDto[],
  ) {
    for (let i = 0; i < tacticsAndOrders.length; i++) {
      await this.db.query(
        `
      UPDATE tactics_stages
      SET
      theOrder = ?
      WHERE
      stageId = ? AND tacticId = ?
      `,
        [tacticsAndOrders[i].theOrder, stageId, tacticsAndOrders[i].tacticId],
      );
    }
  }

  async validateTacticBelongToStage(stageId: number, tacticsId: number) {
    // get all stage tactics
    let stageTacticsIds = await this.getAllStageTacticsIds(stageId);

    if (!stageTacticsIds.includes(Number(tacticsId))) {
      throw new UnprocessableEntityException('Tactic does not belong to stage');
    }
    return true;
  }

  async validateTacticsBelongToStage(
    stageId: number,
    tacticsIdsArray: number[],
  ) {
    // get all stage tactics
    let stageTacticsIds = await this.getAllStageTacticsIds(stageId);

    //validate each tactic belong to the stage
    if (!this.validateArrays(stageTacticsIds, tacticsIdsArray)) {
      throw new UnprocessableEntityException('Tactic does not belong to stage');
    }
    return true;
  }

  async validateTacticStepBelongToTactic(
    tacticId: number,
    tacticStepId: number,
  ) {
    // get all tactic steps
    let tacticStepsIds = await this.getAllTacticStepsIds(tacticId);

    if (!tacticStepsIds.includes(Number(tacticStepId))) {
      throw new UnprocessableEntityException(
        'TacticStep does not belong to tactic',
      );
    }
    return true;
  }

  async getAllTacticStepsIds(tacticId: number): Promise<number[]> {
    let [tacticStepsIds] = await this.db.query(
      `
      SELECT
      CASE WHEN COUNT(tactic_step.id) = 0 THEN JSON_ARRAY()
      ELSE
      JSON_ARRAYAGG(tactic_step.id)
      END AS tacticStepIds
      FROM
      tactic_step
      WHERE tacticId = ?
      `,
      [tacticId],
    );
    return tacticStepsIds.tacticStepIds;
  }

  async checkboxTactic(tacticId: number) {
    var query = `
        UPDATE tactics
        SET tactics.checked = IF(tactics.checked = 0, 1, 0)
        WHERE id = ?
      `;

    await this.db.query(query, [tacticId]);

    return true;
  }

  async checkboxTacticStep(tacticStepId: number) {
    var query = `
        UPDATE tactic_step
        SET tactic_step.checked = IF(tactic_step.checked = 0, 1, 0)
        WHERE id = ?
      `;

    await this.db.query(query, [tacticStepId]);

    return true;
  }

  private validateArrays(arr1, arr2) {
    return arr2.every((num) => arr1.includes(num));
  }
}
