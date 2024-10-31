import { ApiProperty } from '@nestjs/swagger';

export class OtpReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  otp: string;

  @ApiProperty()
  signedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
