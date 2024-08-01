import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  authEmail?: string;
  @ApiProperty()
  contactEmail?: string;
  @ApiProperty()
  password?: string;
  @ApiProperty()
  phoneNumber?: string;
  @ApiProperty()
  forgetPasswordOtp?: string;
  @ApiProperty()
  credits?: number;
  @ApiProperty()
  profilePicture?: string;
  @ApiProperty()
  googleId?: string;
  @ApiProperty()
  facebookId?: string;
  @ApiProperty()
  userOnboarded?: boolean;
}
