import { IsNotEmpty } from 'class-validator';

export class RoleIdDto {
  @IsNotEmpty()
  roleId: number;
}
