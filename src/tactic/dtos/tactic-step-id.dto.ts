import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TacticStepIdDto {
  @ApiProperty()
  @IsNotEmpty()
  tacticStepId: number;
}
