import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

export class UserCreateForAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: UserRoleEnum })
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  type: UserRoleEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // credits: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  roleId: number;
}
