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

  @Post('onboarding-flow')
  async onboardingFlow(@Body() template: OnboardingTemplateDto) {
    return this.templateService.setOnboardingTemplate(template);
  }

  @Get('onboarding-flow/step/:step')
  @UseGuards(AuthGuard)
  async getOnboardingFlowStep(
    @Param() params: { step: number },
    @UserId() userId: number,
  ) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );
    return await this.templateService.getTemplateStepQuestion(
      onboardingTemplate.id,
      Number(params.step),
      userId,
    );
  }

  @Post('onboarding-flow/step/:step')
  async postOnboardingFlowStep(
    @Body() questionAnswer: OnboardingQuestionAnswer,
    @Param() params: { step: number },
    @UserId() userId: number,
  ) {
    let onboardingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );
    return await this.templateService.answerTemplateQuestion(
      onboardingTemplate.id,
      Number(params.step),
      questionAnswer.answer,
      userId,
    );
  }
}
