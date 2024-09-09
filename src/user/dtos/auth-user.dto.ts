import { ApiProperty } from '@nestjs/swagger';
import { UserRoleDto } from './user-role.dto';
import { PermissionsCreateDto } from 'src/role/dtos/permission-create.dto';

export class AuthUserDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  blocked?: boolean;
  @ApiProperty()
  authEmail?: string;
  @ApiProperty()
  contactEmail?: string;
  @ApiProperty()
  phoneNumber?: string;
  @ApiProperty()
  credits?: number;
  @ApiProperty()
  profilePicture?: string;
  @ApiProperty()
  roleId?: number;

  @ApiProperty({ type: UserRoleDto })
  role?: UserRoleDto;
  @ApiProperty()
  googleId?: string;
  @ApiProperty()
  facebookId?: string;
  @ApiProperty()
  userOnboarded?: boolean;

  @ApiProperty()
  userPermissions?: PermissionsCreateDto;
}
