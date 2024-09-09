import { ApiProperty } from '@nestjs/swagger';
import { PermissionsCreateDto } from 'src/role/dtos/permission-create.dto';

export class UserRoleWithPermissionsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: PermissionsCreateDto })
  permissions: PermissionsCreateDto;
}
