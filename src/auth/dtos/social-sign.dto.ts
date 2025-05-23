import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialSignDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
