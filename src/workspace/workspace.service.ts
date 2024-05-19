import { Injectable } from '@nestjs/common';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { WorkspaceRepository } from './workspace.repository';

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

  async userHasWorkspace(userId): Promise<boolean> {
    let userWorkspaces =
      await this.workspaceRepository.findUserWorkspaces(userId);
    if (userWorkspaces.length > 0) {
      return true;
    } else {
      return false;
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
