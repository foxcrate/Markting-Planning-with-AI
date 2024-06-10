import { ApiProperty } from '@nestjs/swagger';

export class GoogleDataReturnDto {
  @ApiProperty()
  googleId: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profilePicture: string;
}
