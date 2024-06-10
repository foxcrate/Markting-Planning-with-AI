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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';

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
  async getAll(@Query() params: TacticNameDto) {
    return await this.tacticService.getAll(params.name);
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

  // get all my private tactics
  @ApiQuery({ name: 'private', required: false })
  @ApiQuery({ name: 'name', required: false })
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
    @Query() filter: TacticsFilterDto,
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
