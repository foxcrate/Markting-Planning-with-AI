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
import { UserId } from 'src/decorators/user-id.decorator';
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
import { FlowCreateDto } from './dtos/flow-create.dto';
import { FlowReturnDto } from './dtos/flow-return.dto';
import { FunnelIdDto } from './dtos/funnel-id.dto';
import { FlowIdDto } from './dtos/flow-id.dto';
import { FlowUpdateDto } from './dtos/flow-update.dto';
import { FlowDetailsReturnDto } from './dtos/flow-details-return.dto';
import { FlowService } from './flow.service';
import { CommentCreateDto } from 'src/comment/dtos/comment-create.dto';
import { CommentUpdateDto } from 'src/comment/dtos/comment-update.dto';
import { FlowCommentIdDto } from './dtos/flow-comment-id.dto';

@Controller({ path: 'flow', version: '1' })
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @ApiBody({ type: FlowCreateDto })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Create')
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createBody: FlowCreateDto, @UserId() userId: number) {
    return await this.flowService.create(createBody, userId);
  }

  @ApiParam({
    name: 'funnelId',
  })
  @ApiCreatedResponse({
    type: FlowReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Get All')
  @Get('all/:funnelId')
  @UseGuards(AuthGuard)
  async getAll(@Param() params: FunnelIdDto, @UserId() userId: number) {
    return await this.flowService.getAll(params.funnelId, userId);
  }

  //get one flow
  @ApiParam({
    name: 'flowId',
  })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Get One')
  @Get('/:flowId')
  @UseGuards(AuthGuard)
  async getOne(@Param() paramsId: FlowIdDto, @UserId() userId: number) {
    return await this.flowService.getOne(paramsId.flowId, userId);
  }

  @ApiParam({
    name: 'flowId',
  })
  @ApiBody({ type: FlowUpdateDto })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Update')
  @Put('/:flowId')
  @UseGuards(AuthGuard)
  async update(
    @Body() updateBody: FlowUpdateDto,
    @Param() paramsId: FlowIdDto,
    @UserId() userId: number,
  ) {
    return await this.flowService.update(updateBody, paramsId.flowId, userId);
  }

  @ApiParam({
    name: 'flowId',
  })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Delete')
  @Delete('/:flowId')
  @UseGuards(AuthGuard)
  async delete(@Param() paramsId: FlowIdDto, @UserId() userId: number) {
    return await this.flowService.delete(paramsId.flowId, userId);
  }

  @ApiParam({
    name: 'flowId',
  })
  @ApiBody({ type: CommentCreateDto })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Comment: Create')
  @Post('/comment/:flowId')
  @UseGuards(AuthGuard)
  async commentCreate(
    @Body() createBody: CommentCreateDto,
    @Param() paramsId: FlowIdDto,
    @UserId() userId: number,
  ) {
    return await this.flowService.createComment(
      createBody,
      paramsId.flowId,
      userId,
    );
  }

  @ApiParam({
    name: 'flowId',
  })
  @ApiParam({
    name: 'commentId',
  })
  @ApiBody({ type: CommentUpdateDto })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Comment: Update')
  @Put('/comment/:flowId/:commentId')
  @UseGuards(AuthGuard)
  async commentUpdate(
    @Body() updateBody: CommentUpdateDto,
    @Param() params: FlowCommentIdDto,
    @UserId() userId: number,
  ) {
    return await this.flowService.updateComment(
      updateBody,
      params.flowId,
      params.commentId,
      userId,
    );
  }

  @ApiParam({
    name: 'flowId',
  })
  @ApiParam({
    name: 'commentId',
  })
  @ApiCreatedResponse({
    type: FlowDetailsReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Flow: Comment: Delete')
  @Delete('/comment/:flowId/:commentId')
  @UseGuards(AuthGuard)
  async commentDelete(
    @Param() params: FlowCommentIdDto,
    @UserId() userId: number,
  ) {
    return await this.flowService.deleteComment(
      params.flowId,
      params.commentId,
      userId,
    );
  }
}
