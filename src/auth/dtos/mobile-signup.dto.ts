import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MobileSignUpDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;
}
