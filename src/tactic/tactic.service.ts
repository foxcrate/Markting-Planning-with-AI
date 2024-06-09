import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TacticRepository } from './tactic.repository';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { TacticsFilterDto } from './dtos/tactic-filter.dto';

@Injectable()
export class TacticService {
  constructor(private readonly tacticRepository: TacticRepository) {}
  async create(
    tacticCreateBody: TacticCreateDto,
    userId: number,
  ): Promise<TacticReturnDto> {
    return await this.tacticRepository.create(tacticCreateBody, userId);
  }

  async update(
    updateBody: TacticUpdateDto,
    tacticId: number,
    userId: number,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);
    await this.tacticRepository.update(updateBody, tacticId);
    return await this.tacticRepository.findById(tacticId);
  }

  //get one tactic
  async getOne(tacticId: number, userId: number): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);
    return await this.tacticRepository.findById(tacticId);
  }

  async getMyTactics(
    userId: number,
    filter: TacticsFilterDto,
  ): Promise<TacticReturnDto[]> {
    return await this.tacticRepository.getTacticsByUserId(userId, filter);
  }

  //get all tactics
  async getAll(name: string): Promise<TacticReturnDto[]> {
    return await this.tacticRepository.findAll(name);
  }

  async delete(tacticId: number, userId: number): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);
    let deletedTactic = await this.tacticRepository.findById(tacticId);
    await this.tacticRepository.delete(tacticId);
    return deletedTactic;
  }

  async addTacticToStage(
    tacticId: number,
    stageId: number,
    userId: number,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);
    await this.tacticRepository.addToStage(tacticId, stageId, 0);
    return await this.tacticRepository.findById(tacticId);
  }

  async addAssistantTacticsToStage(
    stageId: number,
    tactics: any[],
  ): Promise<any> {
    // await this.isOwner(tacticId, userId);
    // create tactics
    await this.tacticRepository.createTactics(tactics, stageId);
  }

  //remove tactic from stage
  async removeTacticFromStage(
    tacticId: number,
    stageId: number,
    userId: number,
  ): Promise<TacticReturnDto> {
    await this.isOwner(tacticId, userId);
    await this.tacticRepository.removeFromStage(tacticId, stageId);
    return await this.tacticRepository.findById(tacticId);
  }

  //authenticate tactic owner

  async isOwner(tacticId: number, userId: number) {
    // return true;
    const tactic = await this.tacticRepository.findById(tacticId);

    if (!tactic) {
      throw new UnprocessableEntityException('Tactic not found');
    }
    if (tactic.userId == null || tactic.private == false) {
      return true;
    }
    if (tactic.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this tactic');
    }
  }
}
