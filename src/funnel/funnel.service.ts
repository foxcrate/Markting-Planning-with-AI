import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FunnelModel } from './funnel.model';
import { FunnelCreateDto } from './dtos/funnel-create.dto';
import { StageCreateDto } from './dtos/stage-create.dto';
import { FunnelUpdateDto } from './dtos/funnel-update.dto';

@Injectable()
export class FunnelService {
  constructor(private readonly funnelModel: FunnelModel) {}
  async create(funnelCreateBody: FunnelCreateDto, userId: number) {
    return await this.funnelModel.create(funnelCreateBody, userId);
  }

  async update(updateBody: FunnelUpdateDto, funnelId: number, userId: number) {
    await this.isOwner(funnelId, userId);
    await this.funnelModel.update(updateBody, funnelId);
    return await this.funnelModel.findById(funnelId);
  }

  //get one funnel
  async getOne(funnelId: number, userId: number) {
    await this.isOwner(funnelId, userId);
    return await this.funnelModel.findById(funnelId);
  }

  //get all funnels
  async getAll(userId: number) {
    return await this.funnelModel.findAll(userId);
  }

  async delete(funnelId: number, userId: number) {
    await this.isOwner(funnelId, userId);
    let deletedFunnel = await this.funnelModel.findById(funnelId);
    await this.funnelModel.delete(funnelId);
    return deletedFunnel;
  }

  //authenticate funnel owner

  async isOwner(funnelId: number, userId: number) {
    const funnel = await this.funnelModel.findById(funnelId);
    if (!funnel) {
      throw new UnprocessableEntityException('Funnel not found');
    }
    if (funnel.userId !== userId) {
      throw new UnprocessableEntityException(
        'You are not the owner of this funnel',
      );
    }
  }
}
