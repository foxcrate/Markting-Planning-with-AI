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
import { FunnelReturnDto } from './dtos/funnel-return.dto';

@Controller({ path: 'funnel', version: '1' })
export class FunnelController {
  constructor(private readonly funnelService: FunnelService) {}

  @ApiBody({ type: FunnelCreateDto })
  @ApiCreatedResponse({
    type: FunnelReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Funnel: Create')
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() funnelCreateBody: FunnelCreateDto,
    @UserId() userId: number,
  ) {
    return await this.funnelService.create(funnelCreateBody, userId);
  }

  //get all funnels
  @ApiCreatedResponse({
    type: FunnelReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Funnel: Get All')
  @Get()
  @UseGuards(AuthGuard)
  async getAll(@UserId() userId: number) {
    return await this.funnelService.getAll(userId);
  }

  //get one funnel
  @ApiParam({
    name: 'funnelId',
  })
  @ApiCreatedResponse({
    type: FunnelReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Funnel: Get One')
  @Get('/:funnelId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: FunnelIdDto, @UserId() userId: number) {
    return await this.funnelService.getOne(paramsId.funnelId, userId);
  }

  @ApiBody({ type: FunnelCreateDto })
  @ApiCreatedResponse({
    type: FunnelReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Funnel: Update')
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

  //delete funnel
  @ApiCreatedResponse({
    type: FunnelReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Funnel: Delete')
  @Delete('/:funnelId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: FunnelIdDto, @UserId() userId: number) {
    return await this.funnelService.delete(paramsId.funnelId, userId);
  }
}
