import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from 'src/user/dtos/auth-user.dto';

export class AuthReturnDto {
  @ApiProperty()
  user: AuthUserDto;
  @ApiProperty()
  token: string;
  @ApiProperty()
  refreshToken: string;
}
