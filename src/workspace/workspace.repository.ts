import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { WorkspaceDto } from './dtos/workspace.dto';
import { WorkspaceUpdateDto } from './dtos/workspace-update.dto';

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(workspace: WorkspaceDto): Promise<WorkspaceReturnDto> {
    const { name, goal, budget, targetGroup, marketingLevel, userId } =
      workspace;

    const query = `
      INSERT INTO workspaces (name, goal, budget, targetGroup, marketingLevel , userId) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [name, goal, budget, targetGroup, marketingLevel, userId];

    const createdWorkspace = await this.entityManager.query(query, params);
    return await this.findById(createdWorkspace.insertId);
  }

  async updateFirstWorkspace(
    workspace: WorkspaceUpdateDto,
    userId: number,
  ): Promise<WorkspaceReturnDto> {
    // get user first workspace
    let userWorkspaces = await this.findAllUserWorkspaces(userId);
    // console.log({ userWorkspaces });

    if (userWorkspaces.length == 0) {
      throw new UnprocessableEntityException('User has no workspaces');
    }

    const query = `
      UPDATE workspaces
      SET
      name = IFNULL(?,workspaces.name),
      goal = IFNULL(?,workspaces.goal),
      budget = IFNULL(?,workspaces.budget),
      targetGroup = IFNULL(?,workspaces.targetGroup),
      marketingLevel = IFNULL(?,workspaces.marketingLevel)
      WHERE id = ?
    `;
    const params = [
      workspace.name,
      workspace.goal,
      workspace.budget,
      workspace.targetGroup,
      workspace.marketingLevel,
      userWorkspaces[0].id,
    ];
    await this.entityManager.query(query, params);

    return this.findById(userWorkspaces[0].id);
  }

  async update(
    workspace: WorkspaceUpdateDto,
    workspaceId: number,
  ): Promise<WorkspaceReturnDto> {
    const query = `
      UPDATE workspaces
      SET
      name = IFNULL(?,workspaces.name),
      goal = IFNULL(?,workspaces.goal),
      budget = IFNULL(?,workspaces.budget),
      targetGroup = IFNULL(?,workspaces.targetGroup),
      marketingLevel = IFNULL(?,workspaces.marketingLevel),
      confirmed = true
      WHERE id = ?
    `;
    const params = [
      workspace.name,
      workspace.goal,
      workspace.budget,
      workspace.targetGroup,
      workspace.marketingLevel,
      workspaceId,
    ];
    await this.entityManager.query(query, params);
    return await this.findById(workspaceId);
  }

  async confirmFirstWorkspace(userId: number) {
    // get user first workspace
    let userWorkspaces = await this.findUserUnConfirmedWorkspaces(userId);
    // console.log({ userWorkspaces });

    if (userWorkspaces.length == 0) {
      throw new UnprocessableEntityException(
        'User has no unconfirmed workspaces',
      );
    }
    const query = `
      UPDATE workspaces
      SET
      confirmed = true
      WHERE id = ?
    `;
    await this.entityManager.query(query, [userWorkspaces[0].id]);
    return await this.findById(userWorkspaces[0].id);
  }

  async confirm(id: number) {
    const query = `
      UPDATE workspaces
      SET
      confirmed = true
      WHERE id = ?
    `;
    await this.entityManager.query(query, [id]);
    return await this.findById(id);
  }

  async findById(id): Promise<WorkspaceReturnDto> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.name,
      workspaces.goal,
      workspaces.budget,
      workspaces.targetGroup,
      workspaces.marketingLevel,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.id = ?
  `;

    const [theWorkspace] = await this.entityManager.query(query, [id]);

    return theWorkspace;
  }

  async findAllUserWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.name,
      workspaces.goal,
      workspaces.budget,
      workspaces.targetGroup,
      workspaces.marketingLevel,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.userId = ?
    ORDER BY workspaces.createdAt ASC
  `;

    const theWorkspaces = await this.entityManager.query(query, [userId]);

    return theWorkspaces;
  }

  async findUserConfirmedWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.name,
      workspaces.goal,
      workspaces.budget,
      workspaces.targetGroup,
      workspaces.marketingLevel,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.userId = ?
    AND workspaces.confirmed = true
    ORDER BY workspaces.createdAt ASC
  `;

    const theWorkspaces = await this.entityManager.query(query, [userId]);

    return theWorkspaces;
  }

  async findUserUnConfirmedWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
    let query = `
    SELECT
      workspaces.id,
      workspaces.name,
      workspaces.goal,
      workspaces.budget,
      workspaces.targetGroup,
      workspaces.marketingLevel,
      workspaces.userId
    FROM workspaces
    WHERE workspaces.userId = ?
    AND workspaces.confirmed = false
    ORDER BY workspaces.createdAt ASC
  `;

    const theWorkspaces = await this.entityManager.query(query, [userId]);

    return theWorkspaces;
  }
}
