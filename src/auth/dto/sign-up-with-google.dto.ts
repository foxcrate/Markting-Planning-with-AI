import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInUpDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
