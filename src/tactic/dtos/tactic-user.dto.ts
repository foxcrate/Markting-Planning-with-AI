import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

export class TacticUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  type: UserRoleEnum;
}
