import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AiResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aiResponse: string;
}
