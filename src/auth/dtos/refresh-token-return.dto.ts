import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dtos/user.dto';

export class RefreshTokenReturnDto {
  @ApiProperty()
  user: UserDto;
  @ApiProperty()
  token: string;
}
