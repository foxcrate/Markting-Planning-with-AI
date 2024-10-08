import { ApiProperty } from '@nestjs/swagger';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';

export class OtpReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  otp: string;

  @ApiProperty({ enum: OtpTypeEnum })
  otpType: OtpTypeEnum;

  @ApiProperty()
  signedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
