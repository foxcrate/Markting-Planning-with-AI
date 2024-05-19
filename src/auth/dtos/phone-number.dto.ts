import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneNumberDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
