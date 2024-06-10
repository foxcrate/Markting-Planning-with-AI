import { ApiProperty } from '@nestjs/swagger';

export class SignInReturnDto {
  @ApiProperty()
  message: string;
}
