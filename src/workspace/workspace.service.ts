import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { WorkspaceRepository } from './workspace.repository';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async create(workspaceData, userId): Promise<WorkspaceReturnDto> {
    return await this.workspaceRepository.create(workspaceData, userId);
  }

  async update(id: number, workspaceData: any, userId: number): Promise<any> {
    // validate worspace parameters
    let onboardingParameters =
      await this.workspaceRepository.getOnboardingParametersNames();

    let workspaceDataKeys = Object.keys(workspaceData);
    onboardingParameters.forEach((key) => {
      if (!workspaceDataKeys.includes(key)) {
        throw new UnprocessableEntityException('Invalid workspace data');
      }
    });
    let updatedWorkspace: any = {};

    if (id == 0) {
      updatedWorkspace = await this.workspaceRepository.updateFirstWorkspace(
        workspaceData,
        userId,
      );
    } else {
      await this.isOwner(id, userId);
      updatedWorkspace = await this.workspaceRepository.update(
        workspaceData,
        id,
      );
    }
    return {
      keys: onboardingParameters,
      wholeObject: updatedWorkspace.parameters,
    };
  }

  async confirm(id: number, updateBody: any, userId: number): Promise<any> {
    let updatedWorkspace: any = {};

    // validate worspace parameters
    let onboardingParameters =
      await this.workspaceRepository.getOnboardingParametersNames();

    let workspaceDataKeys = Object.keys(updateBody);
    onboardingParameters.forEach((key) => {
      if (!workspaceDataKeys.includes(key)) {
        throw new UnprocessableEntityException('Invalid workspace data');
      }
    });

    if (id == 0) {
      updatedWorkspace = await this.workspaceRepository.updateFirstWorkspace(
        updateBody,
        userId,
      );
    } else {
      await this.isOwner(id, userId);
      updatedWorkspace = await this.workspaceRepository.update(updateBody, id);
    }
    return {
      keys: onboardingParameters,
      wholeObject: updatedWorkspace.parameters,
    };
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

  async getOne(id: number, userId: number): Promise<any> {
    let workspace: any = {};
    let onboardingParameters =
      await this.workspaceRepository.getOnboardingParametersNames();
    if (id === 0) {
      let userConfirmedWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
      workspace = userConfirmedWorkspaces[0];
    } else {
      await this.isOwner(id, userId);
      workspace = await this.workspaceRepository.findById(id);
    }
    return {
      keys: onboardingParameters,
      wholeObject: workspace.parameters,
    };
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
}
