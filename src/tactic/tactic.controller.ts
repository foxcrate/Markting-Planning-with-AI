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
import { TacticService } from './tactic.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticIdDto } from './dtos/tactic-id.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { AddTacticToStageIdsDto } from './dtos/add-tactic-to-stage.dto';

@Controller({ path: 'tactic', version: '1' })
export class TacticController {
  constructor(private readonly tacticService: TacticService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() tacticBody: TacticCreateDto, @UserId() userId: number) {
    return await this.tacticService.create(tacticBody, userId);
  }

  @Put('/:tacticId')
  @UseGuards(AuthGuard)
  async update(
    @Body() tacticUpdateBody: TacticUpdateDto,
    @Param() paramsId: TacticIdDto,
    @UserId() userId: number,
  ) {
    return await this.tacticService.update(
      tacticUpdateBody,
      paramsId.tacticId,
      userId,
    );
  }

  //get one tactic

  @Get('/:tacticId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: TacticIdDto, @UserId() userId: number) {
    return await this.tacticService.getOne(paramsId.tacticId, userId);
  }

  //get all tactics
  @Get()
  @UseGuards(AuthGuard)
  async getAll() {
    return await this.tacticService.getAll();
  }

  //delete tactic

  @Delete('/:tacticId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: TacticIdDto, @UserId() userId: number) {
    return await this.tacticService.delete(paramsId.tacticId, userId);
  }

  @Post('/:tacticId/add-to-stage/:stageId')
  @UseGuards(AuthGuard)
  async addTacticToStage(
    @Param() paramsIds: AddTacticToStageIdsDto,
    @UserId() userId: number,
  ) {
    return await this.tacticService.addTacticToStage(
      paramsIds.tacticId,
      paramsIds.stageId,
      userId,
    );
  }

  @Delete('/:tacticId/remove-from-stage/:stageId')
  @UseGuards(AuthGuard)
  async removeTacticFromStage(
    @Param() paramsIds: AddTacticToStageIdsDto,
    @UserId() userId: number,
  ) {
    return await this.tacticService.removeTacticFromStage(
      paramsIds.tacticId,
      paramsIds.stageId,
      userId,
    );
  }
}
