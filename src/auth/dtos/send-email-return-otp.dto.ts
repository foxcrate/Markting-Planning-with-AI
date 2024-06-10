import { ApiProperty } from '@nestjs/swagger';

export class SendEmailReturnDto {
  @ApiProperty()
  message: string;
}
