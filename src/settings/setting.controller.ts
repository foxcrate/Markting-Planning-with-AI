import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { SettingService } from './setting.service';
import { SettingReturnDto } from './dtos/setting-return.dto';
import { SettingIdDto } from './dtos/setting-id.dto';
import { SettingUpdateDto } from './dtos/setting-update.dto';
import { RoleGuard } from 'src/gurads/role.guard';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller({ path: 'setting', version: '1' })
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiCreatedResponse({
    type: SettingReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Setting: Get All')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getAll(@UserId() userId: number) {
    return await this.settingService.getAll(userId);
  }

  @ApiParam({
    name: 'settingId',
  })
  @ApiCreatedResponse({
    type: SettingReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Setting: Get One')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/:settingId')
  @UseGuards(AuthGuard, RoleGuard)
  async getOne(@Param() paramsId: SettingIdDto, @UserId() userId: number) {
    return await this.settingService.getOne(paramsId.settingId);
  }

  @ApiParam({
    name: 'settingId',
  })
  @ApiBody({ type: SettingUpdateDto })
  @ApiCreatedResponse({
    type: SettingReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Setting: Update')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('/:settingId')
  @UseGuards(AuthGuard)
  async update(
    @Body() settingUpdateBody: SettingUpdateDto,
    @Param() paramsId: SettingIdDto,
  ) {
    return await this.settingService.update(
      settingUpdateBody,
      paramsId.settingId,
    );
  }
}
