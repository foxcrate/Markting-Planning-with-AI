import { ApiProperty } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PermissionsCreateDto } from './permission-create.dto';
import { Type } from 'class-transformer';

export class RoleUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: PermissionsCreateDto })
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => PermissionsCreateDto)
  permissions: PermissionsCreateDto;
}
