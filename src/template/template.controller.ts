import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateType } from 'src/enums/template-type.enum';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { TemplateRepository } from './template.repository';
import { OnboardingQuestionAnswer } from './dtos/onboarding-question-answer.dto';

@Controller({ path: 'template', version: '1' })
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateRepository: TemplateRepository,
  ) {}

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
}
