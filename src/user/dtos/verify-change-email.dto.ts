import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
