import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmedAnswerDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  documentName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  confirmedAnswer: string;
}
