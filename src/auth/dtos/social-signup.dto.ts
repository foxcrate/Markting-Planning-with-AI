import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class SocialSignUp {
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
  phoneNumber: string;

  @IsOptional()
  googleId: string;

  @IsOptional()
  facebookId: string;
}
