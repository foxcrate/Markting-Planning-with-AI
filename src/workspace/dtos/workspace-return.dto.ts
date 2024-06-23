import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  parameters: {};

  @ApiProperty()
  userId: number;
}
