import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class MobileSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
}
