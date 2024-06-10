import { ApiProperty } from '@nestjs/swagger';

export class FacebookDataReturnDto {
  @ApiProperty()
  facebookId: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profilePicture: string;
}
