import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;
}
