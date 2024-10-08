import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';

export class SignOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ enum: OtpTypeEnum })
  @IsNotEmpty()
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;
}
