import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  email?: string;
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
}
