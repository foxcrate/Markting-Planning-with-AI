import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { UserDto } from './dtos/user.dto';
import { UserCreateForAdminDto } from './dtos/admin/user-create-for-admin.dto';
import { UserUpdateForAdminDto } from './dtos/admin/user-update-for-admin.dto';
import { UserIdDto } from './dtos/userId.dto';
import { PermissionsGuard } from 'src/gurads/permissions.guard';
import { PermissionDictionary } from 'src/role/permission.dictionary';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PaginationGuard } from 'src/gurads/pagination.guard';

@Controller({ path: 'admin/user', version: '1' })
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: UserCreateForAdminDto })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Admin: Create')
  @Post('')
  @Permissions(PermissionDictionary.users.create)
  @UseGuards(AuthGuard, PermissionsGuard)
  async create(
    @Body() reqBody: UserCreateForAdminDto,
    @UserId() adminId: number,
  ) {
    return this.userService.adminCreate(reqBody, adminId);
  }

  @ApiParam({
    name: 'userId',
  })
  @ApiBody({ type: UserUpdateForAdminDto })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Admin: Update')
  @Put('/:userId')
  @Permissions(PermissionDictionary.users.update)
  @UseGuards(AuthGuard, PermissionsGuard)
  async update(
    @Param() paramsId: UserIdDto,
    @Body() reqBody: UserUpdateForAdminDto,
    @UserId() adminId: number,
  ) {
    return this.userService.adminUpdate(paramsId.userId, reqBody, adminId);
  }

  @ApiParam({
    name: 'userId',
  })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Admin: Delete')
  @Delete('/:userId')
  @Permissions(PermissionDictionary.users.delete)
  @UseGuards(AuthGuard, PermissionsGuard)
  async delete(@Param() paramsId: UserIdDto, @UserId() adminId: number) {
    return this.userService.adminDelete(paramsId.userId, adminId);
  }

  @ApiParam({
    name: 'userId',
  })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Admin: GetOne')
  @Get('/:userId')
  @Permissions(PermissionDictionary.users.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  async AdminGetOne(@Param() paramsId: UserIdDto, @UserId() adminId: number) {
    return this.userService.adminGetOne(paramsId.userId, adminId);
  }

  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Admin: GetAll')
  @Get('')
  @Permissions(PermissionDictionary.users.read)
  @UseGuards(AuthGuard, PermissionsGuard, PaginationGuard)
  async AdminGetAll(@Req() request: any, @UserId() adminId: number) {
    return this.userService.adminGetAll(request.pagination, adminId);
  }

  @ApiParam({
    name: 'userId',
  })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Admin: Block')
  @Put('/:userId/block')
  @Permissions(PermissionDictionary.users.block)
  @UseGuards(AuthGuard, PermissionsGuard)
  async AdminBlock(@Param() paramsId: UserIdDto, @UserId() adminId: number) {
    return this.userService.adminBlock(paramsId.userId, adminId);
  }
}
