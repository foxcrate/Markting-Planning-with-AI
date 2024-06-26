import { ApiProperty } from '@nestjs/swagger';

export class StageTacticStepsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  attachment: string;

  @ApiProperty()
  checked: boolean;

  @ApiProperty()
  theOrder: number;
}
