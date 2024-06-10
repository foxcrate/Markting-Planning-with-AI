import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { StageService } from './stage.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { FunnelIdAndStageIdDto } from './dtos/funnelId-and-stageId.dto';
import { FunnelService } from 'src/funnel/funnel.service';
import { updateStageTacticsOrderDto } from './dtos/update-stage-tactics-order.dto';
import { TacticIdDto } from 'src/tactic/dtos/tactic-id.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { StageDetailsReturnDto } from './dtos/stage-details-return.dto';

@Controller({ path: 'funnel/:funnelId/stage', version: '1' })
export class StageController {
  constructor(
    private readonly stageService: StageService,
    private readonly funnelService: FunnelService,
  ) {}

  @ApiParam({
    name: 'funnelId',
  })
  @ApiParam({
    name: 'stageId',
  })
  @ApiCreatedResponse({
    type: StageDetailsReturnDto,
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags("Funnel's Stage:GetOne")
  //
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

  @ApiParam({
    name: 'funnelId',
  })
  @ApiParam({
    name: 'stageId',
  })
  @ApiBody({ type: updateStageTacticsOrderDto })
  @ApiCreatedResponse({
    type: StageDetailsReturnDto,
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags("Funnel's Stage: Update Tactics Order")
  //
  @Put(':stageId/tactics-order')
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

  @ApiParam({
    name: 'funnelId',
  })
  @ApiParam({
    name: 'stageId',
  })
  @ApiBody({ type: TacticIdDto })
  @ApiCreatedResponse({
    type: StageDetailsReturnDto,
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags("Funnel's Stage: Add Tactic To Stage")
  //
  @Post(':stageId/add-tactic')
  @UseGuards(AuthGuard)
  async addTacticToStage(
    @Param() params: FunnelIdAndStageIdDto,
    @Body() body: TacticIdDto,
    @UserId() userId: number,
  ) {
    return await this.stageService.addTacticToStage(
      params.funnelId,
      params.stageId,
      body.tacticId,
      userId,
    );
  }

  @ApiParam({
    name: 'funnelId',
  })
  @ApiParam({
    name: 'stageId',
  })
  @ApiBody({ type: TacticIdDto })
  @ApiCreatedResponse({
    type: StageDetailsReturnDto,
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags("Funnel's Stage: Remove Tactic From Stage")
  //
  @Delete(':stageId/remove-tactic')
  @UseGuards(AuthGuard)
  async removeTacticFromStage(
    @Param() params: FunnelIdAndStageIdDto,
    @Body() body: TacticIdDto,
    @UserId() userId: number,
  ) {
    return await this.stageService.removeTacticFromStage(
      params.funnelId,
      params.stageId,
      body.tacticId,
      userId,
    );
  }
}
