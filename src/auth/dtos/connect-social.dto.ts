import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectSocial {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  googleId: string;

  @IsOptional()
  facebookId: string;
}
