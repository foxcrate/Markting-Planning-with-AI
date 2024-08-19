import { IsNotEmpty } from 'class-validator';

export class FlowCommentIdDto {
  @IsNotEmpty()
  flowId: number;

  @IsNotEmpty()
  commentId: number;
}
