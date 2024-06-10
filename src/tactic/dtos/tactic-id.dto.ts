import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TacticIdDto {
  @ApiProperty()
  @IsNotEmpty()
  tacticId: number;
}
