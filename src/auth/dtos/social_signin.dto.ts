import { IsOptional } from 'class-validator';

export class SocialSignIn {
  @IsOptional()
  googleId: string;

  @IsOptional()
  facebookId: string;
}
