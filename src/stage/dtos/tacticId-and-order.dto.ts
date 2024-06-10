import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TacticIdAndOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tacticId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  theOrder: number;
}
