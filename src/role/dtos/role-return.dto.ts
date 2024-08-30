import { ApiProperty } from '@nestjs/swagger';
import { PermissionsCreateDto } from './permission-create.dto';

export class RoleReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: PermissionsCreateDto })
  permissions: PermissionsCreateDto;
}
