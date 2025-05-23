import { ApiProperty } from '@nestjs/swagger';

export class StageTacticDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  checked: boolean;

  @ApiProperty()
  theOrder: number;
}
