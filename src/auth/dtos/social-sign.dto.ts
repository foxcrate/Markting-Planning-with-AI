import { IsNotEmpty, IsString } from 'class-validator';

export class SocialSignDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
