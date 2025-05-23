import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TacticsPermissionsDto {
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
  hide: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  export: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  import: boolean;
}
