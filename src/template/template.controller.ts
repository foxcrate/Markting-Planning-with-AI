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
  async startOnboarding(@UserId() userId: number) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );
    if (!onboardingTemplate) {
      throw new UnprocessableEntityException('There is no onboarding templatw');
    }
    return await this.templateService.startTemplateFlow(
      onboardingTemplate.id,
      userId,
    );
  }

  @Post('onboarding/answer')
  @UseGuards(AuthGuard)
  async answer(
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
    );
  }

  ///////////////////////// Funnels //////////////////////////////

  @Post('funnel')
  @UseGuards(AuthGuard)
  async setFunnelFlow(@Body() template: FunnelTemplateDto) {
    return this.templateService.setFunnelTemplate(template);
  }

  @Post('funnel/chat')
  @UseGuards(AuthGuard)
  async funnelChat(
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
    );
  }
}
