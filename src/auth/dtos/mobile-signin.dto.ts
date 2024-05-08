import { IsNotEmpty, IsOptional } from 'class-validator';

export class MobileSignInDto {
  @IsNotEmpty()
  phoneNumber: string;
}
