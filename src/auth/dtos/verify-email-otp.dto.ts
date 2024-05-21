import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailOtpDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
