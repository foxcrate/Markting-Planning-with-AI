import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { UsersPermissionsDto } from './permissions-dtos/users-permissions.dto';
import { Type } from 'class-transformer';
import { TacticsPermissionsDto } from './permissions-dtos/tactics-permissions.dto';
import { LogsPermissionsDto } from './permissions-dtos/logs-permissions.dto';
import { TemplatesPermissionsDto } from './permissions-dtos/templates-permissions.dto';

export class PermissionsCreateDto {
  @ApiProperty({ type: UsersPermissionsDto })
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => UsersPermissionsDto)
  users: UsersPermissionsDto;

  @ApiProperty({ type: LogsPermissionsDto })
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => LogsPermissionsDto)
  logs: LogsPermissionsDto;

  @ApiProperty({ type: TacticsPermissionsDto })
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => TacticsPermissionsDto)
  tactics: TacticsPermissionsDto;

  @ApiProperty({ type: TemplatesPermissionsDto })
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => TemplatesPermissionsDto)
  templates: TemplatesPermissionsDto;
}
