import { ApiProperty } from '@nestjs/swagger';

export class CommentUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  profilePicture: string;
}
