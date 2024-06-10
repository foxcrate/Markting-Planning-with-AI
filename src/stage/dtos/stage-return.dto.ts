import { ApiProperty } from '@nestjs/swagger';

export class StageReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;

  @ApiProperty()
  funnelId: number;
}
