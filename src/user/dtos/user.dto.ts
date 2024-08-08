import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/enums/user-roles.enum';

export class UserDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty({ enum: UserRoles })
  type?: UserRoles;
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
}
