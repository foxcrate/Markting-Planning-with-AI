import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FunnelRepository } from './funnel.repository';
import { FunnelCreateDto } from './dtos/funnel-create.dto';
import { FunnelUpdateDto } from './dtos/funnel-update.dto';

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
}
