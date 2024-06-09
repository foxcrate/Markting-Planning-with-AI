import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { StageService } from './stage.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { FunnelIdAndStageIdDto } from './dtos/funnelId-and-stageId.dto';
import { FunnelService } from 'src/funnel/funnel.service';
import { updateStageTacticsOrderDto } from './dtos/update-stage-tactics-order.dto';
import { TacticIdDto } from 'src/tactic/dtos/tactic-id.dto';

@Controller({ path: 'funnel/:funnelId/stage', version: '1' })
export class StageController {
  constructor(
    private readonly stageService: StageService,
    private readonly funnelService: FunnelService,
  ) {}

  @Get(':stageId')
  @UseGuards(AuthGuard)
  async get(@Param() params: FunnelIdAndStageIdDto, @UserId() userId: number) {
    let theFunnel = await this.funnelService.getOne(params.funnelId, userId);
    return await this.stageService.getOne(
      params.stageId,
      theFunnel.userId,
      userId,
    );
  }

  @Put(':stageId')
  @UseGuards(AuthGuard)
  async updateStageTacticsOrder(
    @Param() params: FunnelIdAndStageIdDto,
    @Body() body: updateStageTacticsOrderDto,
    @UserId() userId: number,
  ) {
    let theFunnel = await this.funnelService.getOne(params.funnelId, userId);
    return await this.stageService.updateStageTacticsOrder(
      params.stageId,
      theFunnel.userId,
      userId,
      body.tactics,
    );
  }

  @Post(':stageId/add-tactic')
  @UseGuards(AuthGuard)
  async addTacticToStage(
    @Param() params: FunnelIdAndStageIdDto,
    @Body() body: TacticIdDto,
    @UserId() userId: number,
  ) {
    return await this.tacticService.addTacticToStage(
      body.tacticId,
      body.stageId,
      userId,
    );
  }
}
