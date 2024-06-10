import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
