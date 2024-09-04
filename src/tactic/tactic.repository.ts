import { Inject, Injectable } from '@nestjs/common';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticStepCreateDto } from './dtos/tactic-step-create.dto';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { GetMineFilterDto } from './dtos/get-mine-filter.dto';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';
import { KpiCreateDto } from 'src/kpi/dtos/create.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { TacticDto } from './dtos/tactic.dto';

@Injectable()
export class TacticRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(
    tacticCreateBody: TacticCreateDto,
    userId: number,
  ): Promise<TacticReturnDto> {
    const query = `
    INSERT INTO tactics (name, description,private,globalStageId,userId,instance) VALUES (?,?,?,?,?,?)
  `;
    const params = [
      tacticCreateBody.name,
      tacticCreateBody.description,
      tacticCreateBody.private ? tacticCreateBody.private : false,
      tacticCreateBody.globalStageId,
      userId,
      tacticCreateBody.instance ? tacticCreateBody.instance : false,
    ];

    let { insertId } = await this.db.query(query, params);

    if (tacticCreateBody.kpis && tacticCreateBody.kpis.length > 0) {
      await this.addKpis(Number(insertId), tacticCreateBody.kpis);
    }

    if (tacticCreateBody.steps && tacticCreateBody.steps.length > 0) {
      await this.addSteps(Number(insertId), tacticCreateBody.steps);
    }

    return await this.findById(Number(insertId));
  }

  async addKpis(tacticId: number, kpis: KpiCreateDto[]) {
    let kpisArray = [];
    for (let i = 0; i < kpis.length; i++) {
      kpisArray.push([
        tacticId,
        kpis[i].name,
        kpis[i].unit,
        kpis[i].kpiMeasuringFrequency,
      ]);
    }

    await this.db.batch(
      `INSERT INTO kpis (tacticId,name,unit,kpiMeasuringFrequency) VALUES (?,?,?,?)`,
      kpisArray,
    );
  }

  async addKpi(tacticId: number, kpi: KpiCreateDto) {
    const query = `
    INSERT INTO kpis (tacticId,name,unit,kpiMeasuringFrequency) VALUES (?,?,?,?)
  `;
    const params = [tacticId, kpi.name, kpi.unit, kpi.kpiMeasuringFrequency];

    await this.db.query(query, params);
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

  async deletePastKpis(tacticId: number) {
    const query = `
      DELETE FROM kpis
      WHERE tacticId = ?
    `;
    await this.db.query(query, [tacticId]);
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
    tactics.private,
    tactics.hidden,
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
    AS stages,
    (
      SELECT
        CASE WHEN COUNT(kpis.id) = 0 THEN null
        ELSE
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',kpis.id,
            'name', kpis.name,
            'unit', kpis.unit,
            'kpiMeasuringFrequency', kpis.kpiMeasuringFrequency,
            'kpi_entries', (
              SELECT
              CASE WHEN COUNT(kpi_entry.id) = 0 THEN null
              ELSE
                JSON_ARRAYAGG(JSON_OBJECT(
                  'id',kpi_entry.id,
                  'value', kpi_entry.value,
                  'date', kpi_entry.date,
                  'kpiId', kpi_entry.kpiId
                ))
              END
              FROM kpi_entry
              WHERE kpi_entry.kpiId = kpis.id
            )
          )
        )
        END AS kpis
      FROM
        kpis
      WHERE
        kpis.tacticId = tactics.id
    ) AS kpis
    FROM tactics
    LEFT JOIN global_stages ON global_stages.id = tactics.globalStageId
    LEFT JOIN tactic_step ON tactic_step.tacticId = tactics.id
    LEFT JOIN users ON users.id = tactics.userId
    WHERE tactics.userId = ?
    AND
    tactics.instance = false
    AND
    tactics.hidden = false 
    
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
    updateBody: TacticDto,
    tacticId: number,
  ): Promise<TacticReturnDto> {
    const query = `
      UPDATE tactics
      SET
      name = IFNULL(?,tactics.name),
      description = IFNULL(?,tactics.description),
      private = IFNULL(?,tactics.private),
      hidden = IFNULL(?,tactics.hidden),
      globalStageId = IFNULL(?,tactics.globalStageId)
      WHERE id = ?
    `;
    await this.db.query(query, [
      updateBody.name,
      updateBody.description,
      updateBody.private,
      updateBody.hidden,
      updateBody.globalStageId,
      tacticId,
    ]);

    if (updateBody.steps && updateBody.steps.length == 0) {
      await this.deletePastSteps(tacticId);
    } else if (updateBody.steps && updateBody.steps.length > 0) {
      await this.deletePastSteps(tacticId);
      await this.addSteps(tacticId, updateBody.steps);
    }

    if (updateBody.kpis && updateBody.kpis.length == 0) {
      await this.deletePastKpis(tacticId);
    } else if (updateBody.kpis && updateBody.kpis.length > 0) {
      await this.deletePastKpis(tacticId);
      await this.addKpis(tacticId, updateBody.kpis);
    }

    return await this.findById(tacticId);
  }

  async findById(id: number): Promise<TacticReturnDto> {
    const query = `
      SELECT tactics.id,
      tactics.name,
      tactics.description,
      tactics.private,
      tactics.hidden,
      tactics.userId,
      CASE WHEN COUNT(users.id) = 0 THEN null
      ELSE
      JSON_OBJECT(
        'id',users.id,
        'firstName', users.firstName,
        'lastName', users.lastName,
        'profilePicture', users.profilePicture,
        'type', users.type
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
          CASE WHEN COUNT(kpis.id) = 0 THEN null
          ELSE
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id',kpis.id,
              'name', kpis.name,
              'unit', kpis.unit,
              'kpiMeasuringFrequency', kpis.kpiMeasuringFrequency,
              'kpi_entries', (
                SELECT
                CASE WHEN COUNT(kpi_entry.id) = 0 THEN null
                ELSE
                  JSON_ARRAYAGG(JSON_OBJECT(
                    'id',kpi_entry.id,
                    'value', kpi_entry.value,
                    'date', kpi_entry.date,
                    'kpiId', kpi_entry.kpiId
                  ))
                END
                FROM kpi_entry
                WHERE kpi_entry.kpiId = kpis.id
              )
            )
          )
          END AS kpis
        FROM
          kpis
        WHERE
          kpis.tacticId = ?
      ) AS kpis
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
  async findAll(
    filterOptions: GetAllFilterDto,
    pagination: PaginationDto,
  ): Promise<TacticReturnDto[]> {
    let queryParameters = [];
    const queryStart = `
    SELECT tactics.id,
    tactics.name,
    tactics.description,
    tactics.private,
    tactics.hidden,
    tactics.userId,
    CASE WHEN COUNT(users.id) = 0 THEN null
    ELSE
    JSON_OBJECT(
      'id',users.id,
      'firstName', users.firstName,
      'lastName', users.lastName,
      'profilePicture', users.profilePicture,
      'type', users.type
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
        CASE WHEN COUNT(kpis.id) = 0 THEN null
        ELSE
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',kpis.id,
            'name', kpis.name,
            'unit', kpis.unit,
            'kpiMeasuringFrequency', kpis.kpiMeasuringFrequency,
            'kpi_entries', (
              SELECT
              CASE WHEN COUNT(kpi_entry.id) = 0 THEN null
              ELSE
                JSON_ARRAYAGG(JSON_OBJECT(
                  'id',kpi_entry.id,
                  'value', kpi_entry.value,
                  'date', kpi_entry.date,
                  'kpiId', kpi_entry.kpiId
                ))
              END
              FROM kpi_entry
              WHERE kpi_entry.kpiId = kpis.id
            )
          )
        )
        END AS kpis
      FROM
        kpis
      WHERE
        kpis.tacticId = tactics.id
    ) AS kpis
    FROM tactics
    LEFT JOIN global_stages ON global_stages.id = tactics.globalStageId
    LEFT JOIN tactic_step ON tactic_step.tacticId = tactics.id
    LEFT JOIN users ON users.id = tactics.userId
    WHERE tactics.private = false 
    AND
    tactics.instance = false
    AND
    tactics.hidden = false
    
  `;

    let filter = ``;
    if (filterOptions.name) {
      filter = filter + ` AND tactics.name LIKE '%${filterOptions.name}%' `;
    }

    if (filterOptions.globalStage) {
      filter =
        filter + ` AND global_stages.name = '${filterOptions.globalStage}' `;
    }

    let paginationQuery = ``;
    if (pagination) {
      paginationQuery = `LIMIT ? OFFSET ?`;
      queryParameters = [pagination.limit, pagination.offset];
    }

    let queryEnd = `GROUP BY tactics.id `;

    // console.log(queryStart + filter + queryEnd);
    // console.log('---------------------------------');

    return await this.db.query(
      queryStart + filter + queryEnd + paginationQuery,
      queryParameters,
    );
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
