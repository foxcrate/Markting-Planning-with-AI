import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { RoleGuard } from 'src/gurads/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleService } from './role.service';
import { RoleCreateDto } from './dtos/role-create.dto';
import { RoleReturnDto } from './dtos/role-return.dto';
import { RoleIdDto } from './dtos/role-id.dto';
import { RoleUpdateDto } from './dtos/role-update.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

@Controller({ path: 'role', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBody({ type: RoleCreateDto })
  @ApiCreatedResponse({
    type: RoleReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Role: Create')
  @Post()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async create(@Body() reqBody: RoleCreateDto, @UserId() userId: number) {
    return await this.roleService.create(reqBody);
  }

  @ApiParam({
    name: 'roleId',
  })
  @ApiBody({ type: RoleUpdateDto })
  @ApiCreatedResponse({
    type: RoleReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Role: Update')
  @Put('/:roleId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async update(
    @Body() reqBody: RoleUpdateDto,
    @Param() params: RoleIdDto,
    @UserId() userId: number,
  ) {
    return await this.roleService.update(reqBody, params.roleId);
  }

  @ApiCreatedResponse({
    type: RoleReturnDto,
    isArray: true,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Role: GetAll')
  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async getAll(@UserId() userId: number) {
    return await this.roleService.getAll();
  }

  @ApiParam({
    name: 'roleId',
  })
  @ApiCreatedResponse({
    type: RoleReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Role: GetOne')
  @Get('/:roleId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getOne(@Param() params: RoleIdDto, @UserId() userId: number) {
    return await this.roleService.getOne(params.roleId);
  }

  @ApiParam({
    name: 'roleId',
  })
  @ApiCreatedResponse({
    type: RoleReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Role: Delete')
  @Delete('/:roleId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Param() params: RoleIdDto, @UserId() userId: number) {
    return await this.roleService.delete(params.roleId);
  }

  @ApiCreatedResponse({
    type: RoleReturnDto,
    isArray: true,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Role: Get Permissions Dictionary')
  @Get('/get-permissions')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async getPermissions(@UserId() userId: number) {
    return await this.roleService.getPermissions();
  }
}
