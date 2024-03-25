import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyForgetPasswordOtpDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
