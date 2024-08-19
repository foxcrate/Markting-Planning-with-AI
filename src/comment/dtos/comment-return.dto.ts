import { ApiProperty } from '@nestjs/swagger';
import { CommentUserDto } from './comment-user.dto';

export class CommentReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  flowId: number;

  @ApiProperty({ type: CommentUserDto })
  user: CommentUserDto;
}
