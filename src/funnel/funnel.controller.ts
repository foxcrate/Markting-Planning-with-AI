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
import { FunnelService } from './funnel.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { FunnelCreateDto } from './dtos/funnel-create.dto';
import { FunnelIdDto } from './dtos/funnel-id.dto';
import { FunnelUpdateDto } from './dtos/funnel-update.dto';

@Controller({ path: 'funnel', version: '1' })
export class FunnelController {
  constructor(private readonly funnelService: FunnelService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() funnelCreateBody: FunnelCreateDto,
    @UserId() userId: number,
  ) {
    return await this.funnelService.create(funnelCreateBody, userId);
  }

  @Put('/:funnelId')
  @UseGuards(AuthGuard)
  async update(
    @Body() funnelUpdateBody: FunnelUpdateDto,
    @Param() paramsId: FunnelIdDto,
    @UserId() userId: number,
  ) {
    return await this.funnelService.update(
      funnelUpdateBody,
      paramsId.funnelId,
      userId,
    );
  }

  //get one funnel

  @Get('/:funnelId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: FunnelIdDto, @UserId() userId: number) {
    return await this.funnelService.getOne(paramsId.funnelId, userId);
  }

  //get all funnels
  @Get()
  @UseGuards(AuthGuard)
  async getAll(@UserId() userId: number) {
    return await this.funnelService.getAll(userId);
  }

  //delete funnel

  @Delete('/:funnelId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: FunnelIdDto, @UserId() userId: number) {
    return await this.funnelService.delete(paramsId.funnelId, userId);
  }
}
