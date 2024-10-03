import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userToken: string;
}
