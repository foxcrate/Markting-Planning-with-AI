import { ApiProperty } from '@nestjs/swagger';

export class MessageReturnDto {
  @ApiProperty()
  message: string;
}
