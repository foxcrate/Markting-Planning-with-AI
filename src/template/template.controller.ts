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

// @ApiTags('Template')
@Controller({ path: 'template', version: '1' })
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateRepository: TemplateRepository,
    private readonly workspaceService: WorkspaceService,
    private readonly openAiService: OpenAiService,
  ) {}

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
  @UseGuards(AuthGuard)
  async setOnboardingFlow(@Body() template: OnboardingTemplateDto) {
    return this.templateService.setOnboardingTemplate(template);
  }

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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @Roles('admin', 'customer')
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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
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
  @Roles('admin', 'customer')
  @UseGuards(AuthGuard, RoleGuard)
  async getAll(@Query() filter: GetAllFilterDto) {
    return this.templateService.getAll(filter);
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

  ///////////////////////// Funnels //////////////////////////////

  // @Post('funnel')
  // @UseGuards(AuthGuard)
  // async setFunnelFlow(@Body() template: FunnelTemplateDto) {
  //   return this.templateService.setFunnelTemplate(template);
  // }

  // @Post('funnel/start')
  // @UseGuards(AuthGuard)
  // async startFunnelTemplate(@UserId() userId: number) {
  //   let funnelTemplate = await this.templateRepository.findByType(
  //     TemplateTypeEnum.FUNNEL,
  //   );
  //   if (!funnelTemplate) {
  //     throw new UnprocessableEntityException('There is no funnel template');
  //   }
  //   // let userWorkspace = await this.workspaceService.userWorkspace(userId);
  //   return await this.templateService.startTemplateFlow(
  //     funnelTemplate.id,
  //     userId,
  //     8,
  //     null,
  //     null,
  //   );
  // }

  // @Post('funnel/answer')
  // @UseGuards(AuthGuard)
  // async funnelAnswer(
  //   @Body() questionAnswer: OnboardingQuestionAnswer,
  //   @UserId() userId: number,
  // ) {
  //   let funnelTemplate = await this.templateRepository.findByType(
  //     TemplateTypeEnum.FUNNEL,
  //   );
  //   return await this.templateService.answerTemplateQuestion(
  //     funnelTemplate.id,
  //     questionAnswer.answer,
  //     userId,
  //     8,
  //     null,
  //     null,
  //   );
  // }

  ///////////////////////// Tactics //////////////////////////////

  // @ApiBody({ type: FunnelTemplateDto })
  // @ApiCreatedResponse({
  //   type: TemplateReturnDto,
  // })
  // @ApiUnauthorizedResponse({
  //   type: ErrorResponseDto,
  // })
  // @ApiBearerAuth()
  // @ApiTags('Template: Tactic: Create')
  // @Post('tactic')
  // @UseGuards(AuthGuard)
  // async setTacticFlow(@Body() template: FunnelTemplateDto) {
  //   return this.templateService.setTacticTemplate(template);
  // }

  // @ApiBody({
  //   type: StartTacticTemplateDto,
  // })
  // @ApiCreatedResponse({
  //   type: NotEndedThreadAiResponseDto,
  // })
  // @ApiUnauthorizedResponse({
  //   type: ErrorResponseDto,
  // })
  // @ApiBearerAuth()
  // @ApiTags('Template: Tactic: Start')
  // @Post('tactic/start')
  // @UseGuards(AuthGuard)
  // async startTacticTemplate(
  //   @Body() startTacticTemplateBody: StartTacticTemplateDto,
  //   @UserId() userId: number,
  // ) {
  //   let tacticTemplate = await this.templateRepository.findByType(
  //     TemplateTypeEnum.TACTIC,
  //   );
  //   if (!tacticTemplate) {
  //     throw new UnprocessableEntityException('There is no tactic template');
  //   }
  //   return await this.templateService.startTemplateFlow(
  //     tacticTemplate.id,
  //     userId,
  //     null,
  //     startTacticTemplateBody.funnelId,
  //     startTacticTemplateBody.stageId,
  //   );
  // }

  // @ApiBody({
  //   type: TacticQuestionAnswer,
  // })
  // @ApiCreatedResponse({
  //   type: NotEndedThreadAiResponseDto,
  //   description: 'ThreadEnd boolean will be true when the thread is ended',
  // })
  // @ApiUnauthorizedResponse({
  //   type: ErrorResponseDto,
  // })
  // @ApiBearerAuth()
  // @ApiTags('Template: Tactic: Answer')
  // @Post('tactic/answer')
  // @UseGuards(AuthGuard)
  // async tacticAnswer(
  //   @Body() questionAnswer: TacticQuestionAnswer,
  //   @UserId() userId: number,
  // ) {
  //   let tacticTemplate = await this.templateRepository.findByType(
  //     TemplateTypeEnum.TACTIC,
  //   );
  //   return await this.templateService.answerTemplateQuestion(
  //     tacticTemplate.id,
  //     questionAnswer.answer,
  //     userId,
  //     null,
  //     questionAnswer.funnelId,
  //     questionAnswer.stageId,
  //   );
  // }
}
