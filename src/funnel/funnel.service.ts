import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FunnelRepository } from './funnel.repository';
import { FunnelCreateDto } from './dtos/funnel-create.dto';
import { FunnelUpdateDto } from './dtos/funnel-update.dto';
import { StageCreateDto } from './dtos/stage-create.dto';

@Injectable()
export class FunnelService {
  constructor(private readonly funnelRepository: FunnelRepository) {}
  async create(funnelCreateBody: FunnelCreateDto, userId: number) {
    return await this.funnelRepository.create(funnelCreateBody, userId);
  }

  async update(updateBody: FunnelUpdateDto, funnelId: number, userId: number) {
    await this.isOwner(funnelId, userId);
    await this.funnelRepository.update(updateBody, funnelId);
    return await this.funnelRepository.findById(funnelId);
  }

  //get one funnel
  async getOne(funnelId: number, userId: number) {
    await this.isOwner(funnelId, userId);
    return await this.funnelRepository.findById(funnelId);
  }

  async getOneStage(funnelId: number, stageId: number) {
    await this.isStageOwner(funnelId, stageId);
    return await this.funnelRepository.findStageById(stageId);
  }

  //get all funnels
  async getAll(userId: number) {
    return await this.funnelRepository.findAll(userId);
  }

  async delete(funnelId: number, userId: number) {
    await this.isOwner(funnelId, userId);
    let deletedFunnel = await this.funnelRepository.findById(funnelId);
    await this.funnelRepository.delete(funnelId);
    return deletedFunnel;
  }

  async userHasAssistantFunnel(userId: number): Promise<boolean> {
    let theAssistantFunnel =
      await this.funnelRepository.findUserAssistantFunnel(userId);

    return theAssistantFunnel ? true : false;
  }

  async createAssistantFunnel(
    funnelStagesObject: StageCreateDto[],
    userId: number,
  ) {
    await this.funnelRepository.createAssistantFunnel(
      funnelStagesObject,
      userId,
    );
  }

  async updateAssistantFunnel(
    funnelStagesObject: StageCreateDto[],
    userId: number,
  ) {
    await this.funnelRepository.updateAssistantFunnel(
      funnelStagesObject,
      userId,
    );
  }

  //authenticate funnel owner

  async isOwner(funnelId: number, userId: number) {
    const funnel = await this.funnelRepository.findById(funnelId);
    if (!funnel) {
      throw new UnprocessableEntityException('Funnel not found');
    }
    if (funnel.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this funnel');
    }
  }

  async isStageOwner(funnelId: number, stageId: number) {
    const stage = await this.funnelRepository.findStageById(stageId);
    if (!stage) {
      throw new UnprocessableEntityException('Stage not found');
    }
    if (stage.funnelId !== funnelId) {
      throw new ForbiddenException('You are not the owner of this funnel');
    }
  }
}
