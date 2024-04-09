import { UserDto } from 'src/user/dtos/user.dto';

export class AuthReturnDto {
  user: UserDto;
  token: string;
  refreshToken: string;
}
