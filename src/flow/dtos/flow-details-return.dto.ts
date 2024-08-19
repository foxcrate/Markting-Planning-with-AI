import { ApiProperty } from '@nestjs/swagger';
import { FlowStepCreateDto } from './flow-step-create.dto';
import { CommentReturnDto } from 'src/comment/dtos/comment-return.dto';
import { FlowUserDto } from './flow-user.dto';

export class FlowDetailsReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: FlowStepCreateDto, isArray: true })
  steps: FlowStepCreateDto[];

  @ApiProperty({ type: CommentReturnDto, isArray: true })
  comments: CommentReturnDto[];

  @ApiProperty()
  funnelId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: FlowUserDto })
  user: FlowUserDto;
}
