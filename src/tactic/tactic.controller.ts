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
import { GetMineFilterDto } from './dtos/get-mine-filter.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { GlobalStagesEnum } from 'src/enums/global-stages.enum';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';

@Controller({ path: 'tactic', version: '1' })
export class TacticController {
  constructor(private readonly tacticService: TacticService) {}

  @ApiBody({ type: TacticCreateDto })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Create')
  //
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() tacticBody: TacticCreateDto, @UserId() userId: number) {
    return await this.tacticService.create(tacticBody, userId);
  }

  //get all tactics
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'globalStage', required: false, enum: GlobalStagesEnum })
  @ApiCreatedResponse({
    type: TacticReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Get All')
  //
  @Get('')
  @UseGuards(AuthGuard)
  async getAll(@Query() filter: GetAllFilterDto) {
    return await this.tacticService.getAll(filter);
  }

  @ApiParam({
    name: 'tacticId',
    required: false,
  })
  @ApiBody({ type: TacticUpdateDto })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Update')
  //
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
  @ApiParam({
    name: 'tacticId',
  })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Get One')
  @Get('/:tacticId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: TacticIdDto, @UserId() userId: number) {
    return await this.tacticService.getOne(paramsId.tacticId, userId);
  }

  // get all my tactics
  @ApiQuery({ name: 'private', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'globalStage', required: false, enum: GlobalStagesEnum })
  @ApiCreatedResponse({
    type: TacticReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Get My Tactics')
  //
  @Get('/mine')
  @UseGuards(AuthGuard)
  async getMyTactics(
    @Query() filter: GetMineFilterDto,
    @UserId() userId: number,
  ) {
    return await this.tacticService.getMyTactics(userId, filter);
  }

  //delete tactic
  @ApiParam({
    name: 'tacticId',
  })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Delete')
  //
  @Delete('/:tacticId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: TacticIdDto, @UserId() userId: number) {
    return await this.tacticService.delete(paramsId.tacticId, userId);
  }
}
