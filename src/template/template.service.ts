import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateRepository } from './template.repository';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { TemplateType } from 'src/enums/template-type.enum';
import { MessageRepository } from 'src/message/message.repository';
import { SenderRole } from 'src/enums/sender-role.enum';
import { ThreadRepository } from 'src/thread/thread.repository';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly openAiService: OpenAiService,
    private readonly messageRepository: MessageRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}
  // async create() {
  // }

  async setOnboardingTemplate(template: OnboardingTemplateDto) {
    // check if system has onboarding template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );

    if (existingTemplate) {
      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateType.ONBOARDING,
        type: TemplateType.ONBOARDING,
        flow: template.flow,
      });
    }
    return await this.templateRepository.create({
      name: TemplateType.ONBOARDING,
      type: TemplateType.ONBOARDING,
      flow: template.flow,
    });
  }

  async getOne(templateId: number) {
    let template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new UnprocessableEntityException('Template not found');
    }
    return template;
  }

  // async update() {}

  async getTemplateStepQuestion(
    templateId: number,
    stepNumber: number,
    userId: number,
  ) {
    let template = await this.templateRepository.findById(templateId);

    // check if user already has a user template flow "thread"
    // get or create if not

    let thread = await this.threadRepository.findByTemplateUserIds(
      template.id,
      userId,
    );

    //create user template flow

    if (!thread) {
      thread = await this.threadRepository.create(userId, template.id);
    }

    // update thread template flow step
    await this.threadRepository.update(thread.id, stepNumber);

    //get template step promp from sql
    let wantedFlowStep = template.flow[stepNumber];

    //pass it to gpt

    let aiQuestion = await this.openAiService.promptToAiQuestion(
      wantedFlowStep.prompt,
    );

    // save ai message

    await this.messageRepository.create(
      aiQuestion,
      thread.id,
      SenderRole.OPEN_AI,
      stepNumber,
    );

    //return the gpt msg to front
    return aiQuestion;
  }

  async answerTemplateQuestion(
    templateId: number,
    stepNumber: number,
    questionAnswer: string,
    userId: number,
  ) {
    let template = await this.templateRepository.findById(templateId);

    // check if user already has a user template flow "thread"
    // get or create if not
    let thread = await this.threadRepository.findByTemplateUserIds(
      template.id,
      userId,
    );
    if (!thread) {
      thread = await this.threadRepository.create(userId, template.id);
    }

    // update thread template flow step
    await this.threadRepository.update(thread.id, stepNumber);

    // save new message
    await this.messageRepository.create(
      questionAnswer,
      thread.id,
      SenderRole.USER,
      stepNumber,
    );

    // summarization
  }
}
