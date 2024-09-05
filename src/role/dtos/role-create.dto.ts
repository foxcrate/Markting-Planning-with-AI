import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PermissionsCreateDto } from './permission-create.dto';
import { Type } from 'class-transformer';

export class RoleCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: PermissionsCreateDto })
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => PermissionsCreateDto)
  permissions: PermissionsCreateDto;
}
