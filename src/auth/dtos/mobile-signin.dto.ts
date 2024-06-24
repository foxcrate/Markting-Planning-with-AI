import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MobileSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
}
