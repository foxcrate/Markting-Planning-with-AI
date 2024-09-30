import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SettingUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}
