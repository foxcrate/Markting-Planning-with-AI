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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { GlobalStageReturnDto } from './dtos/global-stage-return.dto';

@Controller({ path: 'global-stage', version: '1' })
export class GlobalStageController {
  constructor(private readonly globalStageService: GlobalStageService) {}

  @ApiBody({ type: GlobalStageCreateDto })
  @ApiCreatedResponse({
    type: GlobalStageReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Global Stages: Create')
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() globalStageBody: GlobalStageCreateDto) {
    return await this.globalStageService.create(globalStageBody);
  }

  //get all globalStages
  @ApiCreatedResponse({
    type: GlobalStageReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Global Stages: Get All')
  @Get()
  @UseGuards(AuthGuard)
  async getAll() {
    return await this.globalStageService.getAll();
  }

  @ApiParam({ name: 'globalStageId' })
  @ApiBody({ type: GlobalStageCreateDto })
  @ApiCreatedResponse({
    type: GlobalStageReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Global Stages: Update')
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
  @ApiParam({ name: 'globalStageId' })
  @ApiCreatedResponse({
    type: GlobalStageReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Global Stages: Get One')
  @Get('/:globalStageId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: GlobalStageIdDto) {
    return await this.globalStageService.getOne(paramsId.globalStageId);
  }

  //delete globalStage
  @ApiParam({ name: 'globalStageId' })
  @ApiCreatedResponse({
    type: GlobalStageReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Global Stages: Delete')
  @Delete('/:globalStageId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: GlobalStageIdDto) {
    return await this.globalStageService.delete(paramsId.globalStageId);
  }
}
