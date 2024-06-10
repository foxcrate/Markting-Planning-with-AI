import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
