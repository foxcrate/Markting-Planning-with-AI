import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
