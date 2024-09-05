import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class LogsPermissionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  read: boolean;
}
