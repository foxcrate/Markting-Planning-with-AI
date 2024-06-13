import { ApiProperty } from '@nestjs/swagger';

export class AiCreatedTacticStepDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  theOrder: number;
}
