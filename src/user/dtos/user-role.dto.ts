import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { PermissionsCreateDto } from 'src/role/dtos/permission-create.dto';

export class UserRoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: PermissionsCreateDto })
  permissions: PermissionsCreateDto;
}
