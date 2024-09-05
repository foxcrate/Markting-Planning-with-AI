import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

export class UserUpdateForAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  blocked: boolean;

  @ApiProperty({ enum: UserRoleEnum })
  @IsOptional()
  @IsEnum(UserRoleEnum)
  type: UserRoleEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  credits: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  roleId: number;
}
