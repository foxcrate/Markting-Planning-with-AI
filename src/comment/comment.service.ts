import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CommentCreateDto } from './dtos/comment-create.dto';
import { CommentReturnDto } from './dtos/comment-return.dto';
import { CommentUpdateDto } from './dtos/comment-update.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}
  async create(
    createBody: CommentCreateDto,
    flowId: number,
    userId: number,
  ): Promise<CommentReturnDto> {
    let newComment = await this.commentRepository.create(
      createBody,
      flowId,
      userId,
    );

    return await this.commentRepository.findById(newComment.id);
  }

  async update(
    updateBody: CommentUpdateDto,
    commentId: number,
    userId: number,
  ): Promise<CommentReturnDto> {
    await this.isOwner(commentId, userId);
    await this.commentRepository.update(updateBody, commentId);
    return await this.commentRepository.findById(commentId);
  }

  async getOne(commentId: number, userId: number): Promise<CommentReturnDto> {
    await this.isOwner(commentId, userId);
    return await this.commentRepository.findById(commentId);
  }

  // async getAll(flowId: number, userId: number): Promise<CommentReturnDto[]> {
  //   // validate flow owner
  //   await this.flowService.isOwner(flowId, userId);
  //   return await this.commentRepository.findByFlow(flowId);
  // }

  async delete(commentId: number, userId: number): Promise<CommentReturnDto> {
    await this.isOwner(commentId, userId);
    let deletedComment = await this.commentRepository.findById(commentId);
    await this.commentRepository.delete(commentId);
    return deletedComment;
  }

  //authenticate comment owner

  async isOwner(commentId: number, userId: number) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new UnprocessableEntityException('Comment not found');
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
  }
}
