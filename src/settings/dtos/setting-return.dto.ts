import { ApiProperty } from '@nestjs/swagger';

export class SettingReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}
