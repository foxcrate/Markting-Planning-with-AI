import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FlowRepository } from './flow.repository';
import { FlowCreateDto } from './dtos/flow-create.dto';
import { FlowDetailsReturnDto } from './dtos/flow-details-return.dto';
import { FlowUpdateDto } from './dtos/flow-update.dto';
import { FunnelService } from 'src/funnel/funnel.service';
import { FlowReturnDto } from './dtos/flow-return.dto';
import { CommentService } from 'src/comment/comment.service';
import { CommentCreateDto } from 'src/comment/dtos/comment-create.dto';
import { CommentUpdateDto } from 'src/comment/dtos/comment-update.dto';

@Injectable()
export class FlowService {
  constructor(
    private readonly flowRepository: FlowRepository,
    private readonly funnelService: FunnelService,
    private readonly commentService: CommentService,
  ) {}
  async create(
    createBody: FlowCreateDto,
    userId: number,
  ): Promise<FlowDetailsReturnDto> {
    // validate flow steps order
    let stepsNumber = createBody.steps.map((step) => step.order);
    this.validateFlowStepsIsUniqueAndIncremented(stepsNumber);
    let newFlow = await this.flowRepository.create(createBody, userId);

    return await this.flowRepository.findById(newFlow.id);
  }

  async update(
    updateBody: FlowUpdateDto,
    flowId: number,
    userId: number,
  ): Promise<FlowDetailsReturnDto> {
    await this.isOwner(flowId, userId);
    // validate flow steps order
    if (updateBody.steps) {
      let stepsNumber = updateBody.steps.map((step) => step.order);

      this.validateFlowStepsIsUniqueAndIncremented(stepsNumber);
    }
    await this.flowRepository.update(updateBody, flowId);
    return await this.flowRepository.findById(flowId);
  }

  async getOne(flowId: number, userId: number): Promise<FlowDetailsReturnDto> {
    await this.isOwner(flowId, userId);
    return await this.flowRepository.findById(flowId);
  }

  async getAll(funnelId: number, userId: number): Promise<FlowReturnDto[]> {
    // validate funnel owner
    await this.funnelService.isOwner(funnelId, userId);
    return await this.flowRepository.findByFunnel(funnelId);
  }

  async delete(flowId: number, userId: number): Promise<FlowDetailsReturnDto> {
    await this.isOwner(flowId, userId);
    let deletedFlow = await this.flowRepository.findById(flowId);
    await this.flowRepository.delete(flowId);
    return deletedFlow;
  }

  async createComment(
    createBody: CommentCreateDto,
    flowId: number,
    userId: number,
  ): Promise<FlowDetailsReturnDto> {
    await this.isOwner(flowId, userId);
    await this.commentService.create(createBody, flowId, userId);
    return await this.flowRepository.findById(flowId);
  }

  async updateComment(
    updateBody: CommentUpdateDto,
    flowId: number,
    commentId: number,
    userId: number,
  ): Promise<FlowDetailsReturnDto> {
    await this.isOwner(flowId, userId);
    // validate flow comment relation
    await this.validateFlowCommentRelation(flowId, commentId, userId);
    await this.commentService.update(updateBody, commentId, userId);
    return await this.flowRepository.findById(flowId);
  }

  async deleteComment(
    flowId: number,
    commentId: number,
    userId: number,
  ): Promise<FlowDetailsReturnDto> {
    await this.isOwner(flowId, userId);
    // validate flow comment relation
    await this.validateFlowCommentRelation(flowId, commentId, userId);
    await this.commentService.delete(commentId, userId);
    return await this.flowRepository.findById(flowId);
  }

  //authenticate flow owner

  async isOwner(flowId: number, userId: number) {
    const flow = await this.flowRepository.findById(flowId);

    if (!flow) {
      throw new UnprocessableEntityException('Flow not found');
    }
    if (flow.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this flow');
    }
  }

  async validateFlowCommentRelation(
    flowId: number,
    commentId: number,
    userId: number,
  ) {
    let theComment = await this.commentService.getOne(commentId, userId);

    if (theComment.flowId !== Number(flowId)) {
      throw new ForbiddenException('Comment not found in this flow');
    }
    return true;
  }

  private validateFlowStepsIsUniqueAndIncremented(flowSteps: number[]) {
    const uniqueSet = new Set(flowSteps);
    if (uniqueSet.size !== flowSteps.length) {
      throw new UnprocessableEntityException('Format of steps is not valid');
    }

    // validate all number more than 0
    for (let i = 0; i < flowSteps.length; i++) {
      if (flowSteps[i] <= 0) {
        throw new UnprocessableEntityException('Format of steps is not valid');
      }
    }

    const sortedArr = [...flowSteps].sort((a, b) => a - b);

    //validate starts by 1
    if (sortedArr[0] !== 1) {
      throw new UnprocessableEntityException('Format of steps is not valid');
    }

    if (sortedArr.length <= 1) {
      return true;
    }

    for (let i = 1; i < sortedArr.length; i++) {
      if (sortedArr[i] !== sortedArr[i - 1] + 1) {
        throw new UnprocessableEntityException('Format of steps is not valid');
      }
    }

    return true;
  }
}
