import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectSocialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  authEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty()
  @IsOptional()
  googleId: string;

  @ApiProperty()
  @IsOptional()
  facebookId: string;
}
