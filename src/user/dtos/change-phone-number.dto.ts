import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePhoneNumberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
