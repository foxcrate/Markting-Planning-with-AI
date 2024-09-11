import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { TemplateRepository } from './template.repository';
import { OnboardingQuestionAnswer } from './dtos/onboarding-question-answer.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { TemplateReturnDto } from './dtos/template-return.dto';
import { NotEndedThreadAiResponseDto } from './dtos/not-ended-thread-ai-response.dto';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/gurads/role.guard';
import { TemplateCreateDto } from './dtos/template-create.dto';
import { TemplateIdDto } from './dtos/template-id.dto';
import { TemplateUpdateDto } from './dtos/template-update.dto';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { PermissionsGuard } from 'src/gurads/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionDictionary } from 'src/role/permission.dictionary';

// @ApiTags('Template')
@Controller({ path: 'template', version: '1' })
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateRepository: TemplateRepository,
    private readonly workspaceService: WorkspaceService,
    private readonly openAiService: OpenAiService,
  ) {}

  @ApiBody({
    type: TemplateCreateDto,
    description:
      'maxCharacters must be between 30 and 1000 , generatedDocumentsNum must be between 1 and 6',
  })
  @ApiCreatedResponse({
    type: TemplateReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: CRUD: Create')
  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Permissions(PermissionDictionary.templates.create)
  @UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
  async create(@Body() template: TemplateCreateDto) {
    return this.templateService.create(template);
  }

  @ApiParam({
    name: 'templateId',
  })
  @ApiBody({
    type: TemplateUpdateDto,
    description:
      'maxCharacters must be between 30 and 1000 , generatedDocumentsNum must be between 1 and 6',
  })
  @ApiCreatedResponse({
    type: TemplateReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: CRUD: Update')
  @Put('/:templateId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Permissions(PermissionDictionary.templates.update)
  @UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
  async udpate(
    @Body() template: TemplateUpdateDto,
    @Param() paramsId: TemplateIdDto,
  ) {
    return this.templateService.update(template, paramsId.templateId);
  }

  @ApiParam({
    name: 'templateId',
  })
  @ApiCreatedResponse({
    type: TemplateReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: CRUD: Get One')
  @Get('/:templateId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER, UserRoleEnum.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  async getOne(@Param() paramsId: TemplateIdDto) {
    return this.templateService.getOne(paramsId.templateId);
  }

  @ApiParam({
    name: 'templateId',
  })
  @ApiCreatedResponse({
    type: TemplateReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: CRUD: Delete')
  @Delete('/:templateId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)
  @Permissions(PermissionDictionary.templates.delete)
  @UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
  async delete(@Param() paramsId: TemplateIdDto) {
    return this.templateService.delete(paramsId.templateId);
  }

  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiCreatedResponse({
    type: TemplateReturnDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: CRUD: Get All')
  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CUSTOMER, UserRoleEnum.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  async getAll(@Query() filter: GetAllFilterDto) {
    return this.templateService.getAll(filter);
  }

  ///////////////////////// Onboarding //////////////////////////////

  @ApiBody({ type: OnboardingTemplateDto })
  @ApiCreatedResponse({
    type: TemplateReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: Onboarding: Create')
  @Post('onboarding')
  @Permissions(PermissionDictionary.templates.onboarding)
  @UseGuards(AuthGuard, PermissionsGuard)
  async setOnboardingFlow(
    @Body() template: OnboardingTemplateDto,
  ): Promise<any> {
    return this.templateService.setOnboardingTemplate(template);
  }

  @ApiCreatedResponse({
    type: NotEndedThreadAiResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: Onboarding: Start')
  @Post('onboarding/start')
  @UseGuards(AuthGuard)
  async startOnboardingTemplate(@UserId() userId: number) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateTypeEnum.ONBOARDING,
    );
    if (!onboardingTemplate) {
      throw new UnprocessableEntityException('There is no onboarding template');
    }

    // check if user has a workspace
    if (await this.workspaceService.userHasConfirmedWorkspace(userId)) {
      throw new UnprocessableEntityException('User has a workspace');
    }

    // check user unconfirmed workspace
    let userUnconfirmedWorkspaces =
      await this.workspaceService.userUnConfirmedWorkspace(userId);

    if (userUnconfirmedWorkspaces.length > 0) {
      let assistantMessage = {
        keys: await this.openAiService.getOnboardingParametersName(),
        wholeObject: userUnconfirmedWorkspaces[0].parameters,
      };
      return {
        assistantMessage: assistantMessage,
        threadEnd: true,
      };
    }

    return await this.templateService.startTemplateFlow(
      onboardingTemplate.id,
      userId,
      null,
      null,
      null,
    );
  }

  @ApiBody({ type: OnboardingQuestionAnswer })
  @ApiCreatedResponse({
    type: NotEndedThreadAiResponseDto,
    description: 'ThreadEnd boolean will be true when the thread is ended',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Template: Onboarding: Answer')
  @Post('onboarding/answer')
  @UseGuards(AuthGuard)
  async onboardingAnswer(
    @Body() questionAnswer: OnboardingQuestionAnswer,
    @UserId() userId: number,
  ) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateTypeEnum.ONBOARDING,
    );
    return await this.templateService.answerTemplateQuestion(
      onboardingTemplate.id,
      questionAnswer.answer,
      userId,
      null,
      null,
      null,
    );
  }
}
