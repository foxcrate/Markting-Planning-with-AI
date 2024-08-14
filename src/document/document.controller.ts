import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
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
import { ConfirmedAnswerDto } from './dtos/confirmed-answer.dto';
import { FastifyReply } from 'fastify';

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
    @Body() documentUpdateBody: DocumentUpdateDto,
    @Param() params: DocumentIdDto,
    @UserId() userId: number,
  ) {
    return await this.documentService.update(
      documentUpdateBody,
      params.documentId,
      userId,
    );
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
  @ApiTags('Document: Regenerate Ai Response')
  @Put('regenerate/:documentId')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async regenerateAiResponse(
    @Param() params: DocumentIdDto,
    @UserId() userId: number,
  ) {
    return await this.documentService.regenerateAiResponse(
      params.documentId,
      userId,
    );
  }

  @ApiParam({
    name: 'documentId',
  })
  @ApiBody({ type: ConfirmedAnswerDto })
  @ApiCreatedResponse({
    type: DocumentReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: Confirm Ai Response')
  @Put('confirm-ai/:documentId')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async confirmAiResponse(
    @Param() params: DocumentIdDto,
    @Body() body: ConfirmedAnswerDto,
    @UserId() userId: number,
  ) {
    return await this.documentService.confirmAiResponse(
      params.documentId,
      body.confirmedAnswer,
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

  @ApiParam({
    name: 'documentId',
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: PDF Export')
  @Put('/:documentId/pdf')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async pdfExport(
    @Param() params: DocumentIdDto,
    @UserId() userId: number,
    @Res() res: FastifyReply,
  ) {
    await this.documentService.pdfExport(res, params.documentId, userId);
  }

  @ApiParam({
    name: 'documentId',
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Document: Doc Export')
  @Put('/:documentId/doc')
  @Roles(UserRoleEnum.CUSTOMER)
  @UseGuards(AuthGuard, RoleGuard)
  async docExport(
    @Param() params: DocumentIdDto,
    @UserId() userId: number,
    @Res() res: FastifyReply,
  ) {
    await this.documentService.docExport(res, params.documentId, userId);
  }
}
