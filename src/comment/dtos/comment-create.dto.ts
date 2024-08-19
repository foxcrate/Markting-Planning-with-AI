import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
