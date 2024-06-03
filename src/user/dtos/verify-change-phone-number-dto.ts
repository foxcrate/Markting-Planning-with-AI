import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyChangePhoneNumberDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
