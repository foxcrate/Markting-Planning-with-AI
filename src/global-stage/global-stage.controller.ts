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
import { GlobalStageService } from './global-stage.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { GlobalStageCreateDto } from './dtos/global-stage-create.dto';
import { GlobalStageIdDto } from './dtos/global-stage-id.dto';
import { GlobalStageUpdateDto } from './dtos/global-stage-update.dto';

@Controller({ path: 'global-stage', version: '1' })
export class GlobalStageController {
  constructor(private readonly globalStageService: GlobalStageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() globalStageBody: GlobalStageCreateDto) {
    return await this.globalStageService.create(globalStageBody);
  }

  @Put('/:globalStageId')
  @UseGuards(AuthGuard)
  async update(
    @Body() globalStageUpdateBody: GlobalStageUpdateDto,
    @Param() paramsId: GlobalStageIdDto,
  ) {
    return await this.globalStageService.update(
      globalStageUpdateBody,
      paramsId.globalStageId,
    );
  }

  //get one globalStage

  @Get('/:globalStageId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: GlobalStageIdDto) {
    return await this.globalStageService.getOne(paramsId.globalStageId);
  }

  //get all globalStages
  @Get()
  @UseGuards(AuthGuard)
  async getAll() {
    return await this.globalStageService.getAll();
  }

  //delete globalStage

  @Delete('/:globalStageId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: GlobalStageIdDto) {
    return await this.globalStageService.delete(paramsId.globalStageId);
  }
}
