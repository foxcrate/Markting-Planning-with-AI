import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StageRepository } from './stage.repository';
import { GlobalStageService } from 'src/global-stage/global-stage.service';
import { GlobalStageReturnDto } from 'src/global-stage/dtos/global-stage-return.dto';
import { TacticIdAndOrderDto } from './dtos/tacticId-and-order.dto';
import { FunnelService } from 'src/funnel/funnel.service';
import { TacticService } from 'src/tactic/tactic.service';
import { StageDetailsReturnDto } from './dtos/stage-details-return.dto';

@Injectable()
export class StageService {
  constructor(
    private readonly stageRepository: StageRepository,
    private readonly globalStageService: GlobalStageService,
    private readonly tacticService: TacticService,
    @Inject(forwardRef(() => FunnelService))
    private readonly funnelService: FunnelService,
  ) {}

  async getOne(
    stageId: number,
    funnelUserId: number,
    userId: number,
  ): Promise<StageDetailsReturnDto> {
    await this.isOwner(stageId, funnelUserId, userId);
    return await this.stageRepository.findById(stageId);
  }

  async updateStageTacticsOrder(
    stageId: number,
    funnelUserId: number,
    userId: number,
    tacticsAndOrders: TacticIdAndOrderDto[],
  ) {
    await this.isOwner(stageId, funnelUserId, userId);

    await this.updateStageTacticsOrderValidations(stageId, tacticsAndOrders);

    await this.stageRepository.updateStageTacticsOrder(
      stageId,
      tacticsAndOrders,
    );
    return await this.stageRepository.findById(stageId);
  }

  async addTacticToStage(
    funnelId: number,
    stageId: number,
    tacticId: number,
    userId: number,
  ) {
    let theFunnel = await this.funnelService.getOne(funnelId, userId);
    await this.stageRepository.isOwner(stageId, theFunnel.userId, userId);
    await this.tacticService.getOne(tacticId, userId);
    await this.stageRepository.addTacticToStage(stageId, tacticId, 0);
    return await this.stageRepository.findById(stageId);
  }

  async removeTacticFromStage(
    funnelId: number,
    stageId: number,
    tacticId: number,
    userId: number,
  ): Promise<any> {
    let theFunnel = await this.funnelService.getOne(funnelId, userId);
    await this.stageRepository.isOwner(stageId, theFunnel.userId, userId);
    await this.tacticService.getOne(tacticId, userId);
    await this.stageRepository.removeTacticFromStage(tacticId, stageId);
    return await this.stageRepository.findById(stageId);
  }

  async addGlobalStages(funnelId: number) {
    let allGlobalStages = await this.globalStageService.getAll();

    await this.addStagesToFunnel(funnelId, allGlobalStages);
  }

  async isOwner(stageId: number, funnelUserId: number, userId: number) {
    if (!(await this.stageRepository.isOwner(stageId, funnelUserId, userId))) {
      throw new ForbiddenException('You are not the owner of this funnel');
    }
    return true;
  }

  async updateStageTacticsOrderValidations(
    stageId: number,
    tacticsAndOrders: TacticIdAndOrderDto[],
  ) {
    // validate not repeated tacticId
    let tacticsIdsArray = tacticsAndOrders.map((tactic) => tactic.tacticId);
    this.validateNotRepeatedTacticId(tacticsIdsArray);

    // validate all tactics belong to the stage
    await this.stageRepository.validateTacticsBelongToStage(
      stageId,
      tacticsIdsArray,
    );

    // validate all theOrder number is unique and incremented
    let tacticsOrders = tacticsAndOrders.map((tactic) => tactic.theOrder);

    this.validateTacticOrderIsUniqueAndIncremented(tacticsOrders);
  }

  private validateTacticOrderIsUniqueAndIncremented(tacticsOrders: number[]) {
    const uniqueSet = new Set(tacticsOrders);
    if (uniqueSet.size !== tacticsOrders.length) {
      throw new UnprocessableEntityException('Format of theOrder is not valid');
    }

    const sortedArr = [...tacticsOrders].sort((a, b) => a - b);

    if (sortedArr.length <= 1) {
      return true;
    }

    for (let i = 1; i < sortedArr.length; i++) {
      if (sortedArr[i] !== sortedArr[i - 1] + 1) {
        throw new UnprocessableEntityException(
          'Format of theOrder is not valid',
        );
      }
    }

    return true;
  }

  private validateNotRepeatedTacticId(tacticsIds: number[]) {
    const uniqueSet = new Set(tacticsIds);
    if (uniqueSet.size !== tacticsIds.length) {
      throw new UnprocessableEntityException('Repeated tacticId');
    }
  }

  private addStagesToFunnel(
    funnelId: number,
    globalStages: GlobalStageReturnDto[],
  ) {
    return this.stageRepository.addStagesToFunnel(funnelId, globalStages);
  }
}
