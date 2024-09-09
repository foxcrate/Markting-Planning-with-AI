import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { UserRoleWithPermissionsDto } from './user-role-with-permissions.dto';

export class UserDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  blocked?: boolean;
  @ApiProperty()
  stripeCustomerId?: string;
  @ApiProperty({ enum: UserRoleEnum })
  type?: UserRoleEnum;
  @ApiProperty()
  authEmail?: string;
  @ApiProperty()
  contactEmail?: string;
  @ApiProperty()
  phoneNumber?: string;
  @ApiProperty()
  roleId?: number;
  @ApiProperty({ type: UserRoleWithPermissionsDto })
  role?: UserRoleWithPermissionsDto;
  @ApiProperty()
  credits?: number;
  @ApiProperty()
  profilePicture?: string;
  @ApiProperty()
  googleId?: string;
  @ApiProperty()
  facebookId?: string;
}
