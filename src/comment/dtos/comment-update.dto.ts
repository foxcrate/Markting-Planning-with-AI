import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
