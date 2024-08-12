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
import { DocumentService } from './document.service';
import { DocumentCreateDto } from './dtos/document-create.dto';
import { DocumentReturnDto } from './dtos/document-return.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { DocumentIdDto } from './dtos/document-id.dto';
import { DocumentUpdateDto } from './dtos/document-update.dto';

@Controller({ path: 'document', version: '1' })
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @ApiBody({ type: DocumentCreateDto })
  @ApiCreatedResponse({
    type: DocumentReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: Create')
  @Post()
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async create(
    @Body() documentCreateBody: DocumentCreateDto,
    @UserId() userId: number,
  ) {
    return await this.documentService.create(documentCreateBody, userId);
  }

  @ApiParam({
    name: 'documentId',
  })
  @ApiBody({ type: DocumentUpdateDto })
  @ApiCreatedResponse({
    type: DocumentReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: Update')
  @Put('/:documentId')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async update(
    @Body() documentCreateBody: DocumentCreateDto,
    @Param() params: DocumentIdDto,
    @UserId() userId: number,
  ) {
    return await this.documentService.update(
      documentCreateBody,
      params.documentId,
      userId,
    );
  }

  @ApiCreatedResponse({
    type: DocumentReturnDto,
    isArray: true,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: GetAll')
  @Get()
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async getAll(@UserId() userId: number) {
    return await this.documentService.getAllByUserId(userId);
  }

  @ApiParam({
    name: 'documentId',
  })
  @ApiCreatedResponse({
    type: DocumentReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: GetOne')
  @Get('/:documentId')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async getOne(@Param() params: DocumentIdDto, @UserId() userId: number) {
    return await this.documentService.getOne(params.documentId, userId);
  }

  @ApiParam({
    name: 'documentId',
  })
  @ApiCreatedResponse({
    type: DocumentReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: Delete')
  @Delete('/:documentId')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async delete(@Param() params: DocumentIdDto, @UserId() userId: number) {
    return await this.documentService.delete(params.documentId, userId);
  }
}
