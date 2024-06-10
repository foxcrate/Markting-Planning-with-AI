import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SocialSignInDto {
  @ApiProperty()
  @IsOptional()
  googleId: string;

  @ApiProperty()
  @IsOptional()
  facebookId: string;
}
