import { ApiProperty } from '@nestjs/swagger';

export class GlobalStageReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;
}
