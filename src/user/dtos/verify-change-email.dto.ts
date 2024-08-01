import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyChangeEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;
}
