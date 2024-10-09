import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
