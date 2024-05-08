import { IsNotEmpty, IsString } from 'class-validator';

export class MobileSignUpDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
