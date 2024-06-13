import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceUpdateDto } from './dtos/workspace-update.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async create(workspaceData, userId): Promise<WorkspaceReturnDto> {
    let SerializeWorkspaceData = this.serializeWorkspaceData(workspaceData);

    return await this.workspaceRepository.create({
      ...SerializeWorkspaceData,
      userId,
    });
  }

  async update(
    id: number,
    workspaceData: WorkspaceUpdateDto,
    userId: number,
  ): Promise<WorkspaceReturnDto> {
    if (id == 0) {
      return await this.workspaceRepository.updateFirstWorkspace(
        workspaceData,
        userId,
      );
    } else {
      await this.isOwner(id, userId);
      return await this.workspaceRepository.update(workspaceData, id);
    }
  }

  async confirm(
    id: number,
    updateBody: WorkspaceUpdateDto,
    userId: number,
  ): Promise<WorkspaceReturnDto> {
    if (id == 0) {
      return await this.workspaceRepository.updateFirstWorkspace(
        updateBody,
        userId,
      );
    } else {
      await this.isOwner(id, userId);
      return await this.workspaceRepository.update(updateBody, id);
    }
  }

  async userHasConfirmedWorkspace(userId): Promise<boolean> {
    let userWorkspaces =
      await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
    if (userWorkspaces.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getOne(id: number, userId: number): Promise<WorkspaceReturnDto> {
    await this.isOwner(id, userId);
    return await this.workspaceRepository.findById(id);
  }

  async userUnConfirmedWorkspace(userId): Promise<WorkspaceReturnDto[]> {
    return await this.workspaceRepository.findUserUnConfirmedWorkspaces(userId);
  }

  async userConfirmedWorkspace(userId): Promise<WorkspaceReturnDto[]> {
    return await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
  }

  async isOwner(workspaceId: number, userId: number) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new UnprocessableEntityException('Workspace not found');
    }
    if (workspace.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this workspace');
    }
  }

  private serializeWorkspaceData(workspaceData) {
    return {
      name: workspaceData.project_name,
      goal: workspaceData.project_goal,
      budget: workspaceData.project_budget,
      targetGroup: workspaceData.project_target_group,
      marketingLevel: workspaceData.project_marketing_level,
    };
  }
}
