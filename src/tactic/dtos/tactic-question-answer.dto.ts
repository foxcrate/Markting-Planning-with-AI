import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TacticQuestionAnswer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  funnelId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stageId: number;

  @ApiProperty()
  @IsString()
  answer: string;
}
