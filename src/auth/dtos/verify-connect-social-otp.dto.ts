import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyConnectSocialOtpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  mobileNumber: string;

  @IsOptional()
  googleId: string;

  @IsOptional()
  facebookId: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
