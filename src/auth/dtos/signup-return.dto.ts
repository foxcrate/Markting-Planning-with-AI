import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dtos/user.dto';

export class SignupReturnDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  message: string;
}
