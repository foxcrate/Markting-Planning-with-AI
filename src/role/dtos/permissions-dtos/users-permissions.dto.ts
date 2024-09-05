import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UsersPermissionsDto {
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

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  block: boolean;
}
