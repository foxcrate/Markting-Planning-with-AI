import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { UsersPermissionsDto } from './permissions-dtos/users-permissions.dto';
import { FunnelsPermissionsDto } from './permissions-dtos/funnels-permissions.dto';
import { Type } from 'class-transformer';
import { TacticsPermissionsDto } from './permissions-dtos/tactics-permissions.dto';
import { FlowsPermissionsDto } from './permissions-dtos/flows-permissions.dto';
import { LogsPermissionsDto } from './permissions-dtos/logs-permissions.dto';

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

  // @ApiProperty({ type: FunnelsPermissionsDto })
  // @IsNotEmpty()
  // @ValidateNested()
  // @IsObject()
  // @Type(() => FunnelsPermissionsDto)
  // funnels: FunnelsPermissionsDto;

  @ApiProperty({ type: TacticsPermissionsDto })
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => TacticsPermissionsDto)
  tactics: TacticsPermissionsDto;

  // @ApiProperty({ type: FlowsPermissionsDto })
  // @IsNotEmpty()
  // @ValidateNested()
  // @IsObject()
  // @Type(() => FlowsPermissionsDto)
  // flows: FlowsPermissionsDto;
}
