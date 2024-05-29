import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateType } from 'src/enums/template-type.enum';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { TemplateRepository } from './template.repository';
import { OnboardingQuestionAnswer } from './dtos/onboarding-question-answer.dto';
import { FunnelTemplateDto } from './dtos/funnel-template.dto';
import { StartTacticTemplateDto } from './dtos/start-tactic-template.dto';
import { TacticQuestionAnswer } from 'src/tactic/dtos/tactic-question-answer.dto';

@Controller({ path: 'template', version: '1' })
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateRepository: TemplateRepository,
  ) {}

  ///////////////////////// Onboarding //////////////////////////////

  @Post('onboarding')
  @UseGuards(AuthGuard)
  async setOnboardingFlow(@Body() template: OnboardingTemplateDto) {
    return this.templateService.setOnboardingTemplate(template);
  }

  @Post('onboarding/start')
  @UseGuards(AuthGuard)
  async startOnboardingTemplate(@UserId() userId: number) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );
    if (!onboardingTemplate) {
      throw new UnprocessableEntityException('There is no onboarding template');
    }
    return await this.templateService.startTemplateFlow(
      onboardingTemplate.id,
      userId,
      null,
      null,
      null,
    );
  }

  @Post('onboarding/answer')
  @UseGuards(AuthGuard)
  async onboardingAnswer(
    @Body() questionAnswer: OnboardingQuestionAnswer,
    @UserId() userId: number,
  ) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
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

  @Post('funnel')
  @UseGuards(AuthGuard)
  async setFunnelFlow(@Body() template: FunnelTemplateDto) {
    return this.templateService.setFunnelTemplate(template);
  }

  @Post('funnel/start')
  @UseGuards(AuthGuard)
  async startFunnelTemplate(@UserId() userId: number) {
    let funnelTemplate = await this.templateRepository.findByType(
      TemplateType.FUNNEL,
    );
    if (!funnelTemplate) {
      throw new UnprocessableEntityException('There is no funnel template');
    }
    return await this.templateService.startTemplateFlow(
      funnelTemplate.id,
      userId,
      null,
      null,
      null,
    );
  }

  @Post('funnel/answer')
  @UseGuards(AuthGuard)
  async funnelAnswer(
    @Body() questionAnswer: OnboardingQuestionAnswer,
    @UserId() userId: number,
  ) {
    let funnelTemplate = await this.templateRepository.findByType(
      TemplateType.FUNNEL,
    );
    return await this.templateService.answerTemplateQuestion(
      funnelTemplate.id,
      questionAnswer.answer,
      userId,
      null,
      null,
      null,
    );
  }

  ///////////////////////// Tactics //////////////////////////////

  @Post('tactic')
  @UseGuards(AuthGuard)
  async setTacticFlow(@Body() template: FunnelTemplateDto) {
    return this.templateService.setTacticTemplate(template);
  }

  @Post('tactic/start')
  @UseGuards(AuthGuard)
  async startTacticTemplate(
    @Body() startTacticTemplateBody: StartTacticTemplateDto,
    @UserId() userId: number,
  ) {
    let tacticTemplate = await this.templateRepository.findByType(
      TemplateType.TACTIC,
    );
    if (!tacticTemplate) {
      throw new UnprocessableEntityException('There is no tactic template');
    }
    return await this.templateService.startTemplateFlow(
      tacticTemplate.id,
      userId,
      null,
      startTacticTemplateBody.funnelId,
      startTacticTemplateBody.stageId,
    );
  }

  @Post('tactic/answer')
  @UseGuards(AuthGuard)
  async tacticAnswer(
    @Body() questionAnswer: TacticQuestionAnswer,
    @UserId() userId: number,
  ) {
    let tacticTemplate = await this.templateRepository.findByType(
      TemplateType.TACTIC,
    );
    return await this.templateService.answerTemplateQuestion(
      tacticTemplate.id,
      questionAnswer.answer,
      userId,
      null,
      questionAnswer.funnelId,
      questionAnswer.stageId,
    );
  }
}
