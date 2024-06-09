import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TacticService } from './tactic.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { TacticCreateDto } from './dtos/tactic-create.dto';
import { TacticIdDto } from './dtos/tactic-id.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { TacticUpdateDto } from './dtos/tactic-update.dto';
import { AddTacticToStageIdsDto } from './dtos/add-tactic-to-stage.dto';
import { TacticNameDto } from './dtos/tactic-name.dto';
import { TacticsFilterDto } from './dtos/tactic-filter.dto';
import { RemoveTacticFromStageDto } from './dtos/remove-tactic-from-stage.dto';

@Controller({ path: 'tactic', version: '1' })
export class TacticController {
  constructor(private readonly tacticService: TacticService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() tacticBody: TacticCreateDto, @UserId() userId: number) {
    console.log('create');
    return await this.tacticService.create(tacticBody, userId);
  }

  @Put('/:tacticId')
  @UseGuards(AuthGuard)
  async update(
    @Body() tacticUpdateBody: TacticUpdateDto,
    @Param() paramsId: TacticIdDto,
    @UserId() userId: number,
  ) {
    console.log('update');
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

  // get all my private tactics

  @Get('/mine')
  @UseGuards(AuthGuard)
  async getMyTactics(
    @Query() filter: TacticsFilterDto,
    @UserId() userId: number,
  ) {
    return await this.tacticService.getMyTactics(userId, filter);
  }

  //get all tactics
  @Get('')
  @UseGuards(AuthGuard)
  async getAll(@Query() params: TacticNameDto) {
    console.log('getall');

    // console.log({ params });

    return await this.tacticService.getAll(params.name);
  }

  //delete tactic

  @Delete('/:tacticId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: TacticIdDto, @UserId() userId: number) {
    return await this.tacticService.delete(paramsId.tacticId, userId);
  }

  // @Post('add-to-stage')
  // @UseGuards(AuthGuard)
  // async addTacticToStage(
  //   @Body() body: AddTacticToStageIdsDto,
  //   @UserId() userId: number,
  // ) {
  //   return await this.tacticService.addTacticToStage(
  //     body.tacticId,
  //     body.stageId,
  //     userId,
  //   );
  // }

  // @Delete('remove-from-stage')
  // @UseGuards(AuthGuard)
  // async removeTacticFromStage(
  //   @Body() body: RemoveTacticFromStageDto,
  //   @UserId() userId: number,
  // ) {
  //   return await this.tacticService.removeTacticFromStage(
  //     body.tacticId,
  //     body.stageId,
  //     userId,
  //   );
  // }
}
