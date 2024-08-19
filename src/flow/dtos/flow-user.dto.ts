import { ApiProperty } from '@nestjs/swagger';

export class FlowUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  profilePicture: string;
}
