import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
