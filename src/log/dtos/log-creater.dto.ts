import { ApiProperty } from '@nestjs/swagger';

export class LogCreatorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  profilePicture: string;
}
