import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { WorkspaceDto } from './dtos/workspace.dto';

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

  async findUserWorkspaces(userId): Promise<WorkspaceReturnDto[]> {
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
}
