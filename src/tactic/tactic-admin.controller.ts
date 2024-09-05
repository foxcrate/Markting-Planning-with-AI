import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { PermissionsGuard } from 'src/gurads/permissions.guard';
import { PermissionDictionary } from 'src/role/permission.dictionary';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PaginationGuard } from 'src/gurads/pagination.guard';
import { TacticService } from './tactic.service';
import { TacticCreateForAdminDto } from './dtos/admin/tactic-create-for-admin.dto';
import { TacticReturnDto } from './dtos/tactic-return.dto';
import { GlobalStagesEnum } from 'src/enums/global-stages.enum';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';
import { TacticUpdateForAdminDto } from './dtos/admin/tactic-update-for-admin.dto';
import { TacticIdDto } from './dtos/tactic-id.dto';

@Controller({ path: 'admin/tactic', version: '1' })
export class TacticAdminController {
  constructor(private readonly tacticService: TacticService) {}

  @ApiBody({ type: TacticCreateForAdminDto })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Admin: Create')
  @Post('')
  @Permissions(PermissionDictionary.tactics.create)
  @UseGuards(AuthGuard, PermissionsGuard)
  async create(
    @Body() reqBody: TacticCreateForAdminDto,
    @UserId() adminId: number,
  ) {
    return this.tacticService.adminCreate(reqBody, adminId);
  }

  @ApiParam({
    name: 'tacticId',
  })
  @ApiBody({ type: TacticUpdateForAdminDto })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Admin: Update')
  @Put('/:tacticId')
  @Permissions(PermissionDictionary.tactics.update)
  @UseGuards(AuthGuard, PermissionsGuard)
  async update(
    @Param() paramsId: TacticIdDto,
    @Body() reqBody: TacticUpdateForAdminDto,
    @UserId() adminId: number,
  ) {
    return this.tacticService.adminUpdate(paramsId.tacticId, reqBody, adminId);
  }

  @ApiParam({
    name: 'tacticId',
  })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Admin: Delete')
  @Delete('/:tacticId')
  @Permissions(PermissionDictionary.tactics.delete)
  @UseGuards(AuthGuard, PermissionsGuard)
  async delete(@Param() paramsId: TacticIdDto, @UserId() adminId: number) {
    return this.tacticService.adminDelete(paramsId.tacticId, adminId);
  }

  @ApiParam({
    name: 'tacticId',
  })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Admin: GetOne')
  @Get('/:tacticId')
  @Permissions(PermissionDictionary.tactics.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  async AdminGetOne(@Param() paramsId: TacticIdDto, @UserId() adminId: number) {
    return this.tacticService.adminGetOne(paramsId.tacticId, adminId);
  }

  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'globalStage', required: false, enum: GlobalStagesEnum })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Admin: GetAll')
  @Get('')
  @Permissions(PermissionDictionary.tactics.read)
  @UseGuards(AuthGuard, PermissionsGuard, PaginationGuard)
  async AdminGetAll(
    @Req() request: any,
    @Query() filter: GetAllFilterDto,
    @UserId() adminId: number,
  ) {
    return this.tacticService.adminGetAll(filter, request.pagination, adminId);
  }

  @ApiParam({
    name: 'tacticId',
  })
  @ApiCreatedResponse({
    type: TacticReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Tactic: Admin: Hide')
  @Put('/:tacticId/hide')
  @Permissions(PermissionDictionary.tactics.hide)
  @UseGuards(AuthGuard, PermissionsGuard)
  async AdminBlock(@Param() paramsId: TacticIdDto, @UserId() adminId: number) {
    return this.tacticService.adminHide(paramsId.tacticId, adminId);
  }
}
