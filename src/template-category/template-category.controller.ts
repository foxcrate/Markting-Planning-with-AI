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
import { TemplateCategoryService } from './template-category.service';
import { TemplateCategoryCreateDto } from './dtos/template-category-create.dto';
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
import { TemplateCategoryReturnDto } from './dtos/template-category-return.dto';
import { TemplateCategoryIdDto } from './dtos/template-category-id.dto';
import { RoleGuard } from 'src/gurads/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

@Controller({ path: 'template-category', version: '1' })
export class TemplateCategoryController {
  constructor(
    private readonly templateCategoryService: TemplateCategoryService,
  ) {}

  @ApiBody({ type: TemplateCategoryCreateDto })
  @ApiCreatedResponse({
    type: TemplateCategoryReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template Category: Create')
  @Post()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async create(
    @Body() templateCreateBody: TemplateCategoryCreateDto,
    @UserId() userId: number,
  ) {
    return await this.templateCategoryService.create(
      templateCreateBody,
      userId,
    );
  }

  @ApiParam({
    name: 'templateCategoryId',
  })
  @ApiBody({ type: TemplateCategoryCreateDto })
  @ApiCreatedResponse({
    type: TemplateCategoryReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template Category: Update')
  @Put('/:templateCategoryId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async update(
    @Body() templateCreateBody: TemplateCategoryCreateDto,
    @Param() params: TemplateCategoryIdDto,
    @UserId() userId: number,
  ) {
    return await this.templateCategoryService.update(
      templateCreateBody,
      params.templateCategoryId,
      userId,
    );
  }

  @ApiCreatedResponse({
    type: TemplateCategoryReturnDto,
    isArray: true,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template Category: GetAll')
  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async getAll(@UserId() userId: number) {
    return await this.templateCategoryService.getAll();
  }

  @ApiParam({
    name: 'templateCategoryId',
  })
  @ApiCreatedResponse({
    type: TemplateCategoryReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template Category: GetOne')
  @Get('/:templateCategoryId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async getOne(
    @Param() params: TemplateCategoryIdDto,
    @UserId() userId: number,
  ) {
    return await this.templateCategoryService.getOne(params.templateCategoryId);
  }

  @ApiParam({
    name: 'templateCategoryId',
  })
  @ApiCreatedResponse({
    type: TemplateCategoryReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template Category: Delete')
  @Delete('/:templateCategoryId')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async delete(
    @Param() params: TemplateCategoryIdDto,
    @UserId() userId: number,
  ) {
    return await this.templateCategoryService.delete(
      params.templateCategoryId,
      userId,
    );
  }
}
