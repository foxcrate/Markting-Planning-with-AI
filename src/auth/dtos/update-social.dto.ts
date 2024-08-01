import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateSocialDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  authEmail: string;

  @ApiProperty()
  @IsOptional()
  googleId: string;

  @ApiProperty()
  @IsOptional()
  facebookId: string;
}
