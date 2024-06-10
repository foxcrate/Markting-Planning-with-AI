import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  goal: string;

  @ApiProperty()
  budget: string;

  @ApiProperty()
  targetGroup: string;

  @ApiProperty()
  marketingLevel: string;

  @ApiProperty()
  userId: number;
}
