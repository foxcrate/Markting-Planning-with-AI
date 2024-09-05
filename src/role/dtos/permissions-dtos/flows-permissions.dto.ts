import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class FlowsPermissionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  create: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  read: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  update: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  delete: boolean;
}
