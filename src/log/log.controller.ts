import { Controller, Get, Param, UseGuards, Req, Query } from '@nestjs/common';
import { LogService } from './log.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LogReturnDto } from './dtos/log-return.dto';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { PermissionsGuard } from 'src/gurads/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { PermissionDictionary } from 'src/role/permission.dictionary';
import { UserId } from 'src/decorators/user-id.decorator';
import { LogIdDto } from './dtos/log-id.dto';
import { PaginationGuard } from 'src/gurads/pagination.guard';
import { FastifyRequest } from 'fastify/types/request';

@Controller({ path: 'logs', version: '1' })
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiCreatedResponse({
    type: LogReturnDto,
    isArray: true,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Logs: Get All')
  @Get()
  @Permissions(PermissionDictionary.logs.read)
  @UseGuards(AuthGuard, PermissionsGuard, PaginationGuard)
  async getAll(@Req() request: any, @UserId() adminId: number) {
    return await this.logService.getAll(request.pagination, adminId);
  }

  @ApiParam({
    name: 'logId',
  })
  @ApiCreatedResponse({
    type: LogReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Logs: Get One')
  @Get('/:logId')
  @Permissions(PermissionDictionary.logs.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  async getOne(@Param() params: LogIdDto, @UserId() adminId: number) {
    return await this.logService.getOne(params.logId, adminId);
  }
}
