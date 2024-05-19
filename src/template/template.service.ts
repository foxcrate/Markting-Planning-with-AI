import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateRepository } from './template.repository';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { TemplateType } from 'src/enums/template-type.enum';
import { MessageRepository } from 'src/message/message.repository';
import { SenderRole } from 'src/enums/sender-role.enum';
import { ThreadRepository } from 'src/thread/thread.repository';
import { FunnelTemplateDto } from './dtos/funnel-template.dto';
import { WorkspaceRepository } from 'src/workspace/workspace.repository';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly openAiService: OpenAiService,
    private readonly messageRepository: MessageRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  async setOnboardingTemplate(template: OnboardingTemplateDto) {
    // check if system has onboarding template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );

    let description =
      'Start the conversation by greeting the user and saying who are you.\n' +
      template.description +
      '\n Collect the data step by step. When you collect this data, call the end_flow function';

    if (existingTemplate) {
      await this.openAiService.updateTemplateAssistance(
        existingTemplate.openaiAssistantId,
        TemplateType.ONBOARDING,
        description,
        template.parameters,
      );

      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateType.ONBOARDING,
        type: TemplateType.ONBOARDING,
        description: description,
        parameters: template.parameters,
        openaiAssistantId: existingTemplate.openaiAssistantId,
      });
    }

    let assistance = await this.openAiService.createTemplateAssistance(
      TemplateType.ONBOARDING,
      description,
      template.parameters,
    );

    return await this.templateRepository.create({
      name: TemplateType.ONBOARDING,
      type: TemplateType.ONBOARDING,
      description: description,
      parameters: template.parameters,
      openaiAssistantId: assistance.id,
    });
  }

  async setFunnelTemplate(template: FunnelTemplateDto) {
    // check if system has funnel template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateType.FUNNEL,
    );

    if (existingTemplate) {
      await this.openAiService.updateTemplateAssistance(
        existingTemplate.openaiAssistantId,
        TemplateType.FUNNEL,
        template.description,
        null,
      );

      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateType.FUNNEL,
        type: TemplateType.FUNNEL,
        description: template.description,
        parameters: null,
        openaiAssistantId: existingTemplate.openaiAssistantId,
      });
    }

    let assistance = await this.openAiService.createTemplateAssistance(
      TemplateType.FUNNEL,
      template.description,
      null,
    );

    return await this.templateRepository.create({
      name: TemplateType.FUNNEL,
      type: TemplateType.FUNNEL,
      description: template.description,
      parameters: null,
      openaiAssistantId: assistance.id,
    });
  }

  async getOne(templateId: number) {
    let template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new UnprocessableEntityException('Template not found');
    }
    return template;
  }

  async startTemplateFlow(
    templateId: number,
    userId: number,
    workspaceId: number,
  ) {
    let template = await this.templateRepository.findById(templateId);

    // check if user already has a user template flow "thread"
    // get or create if not
    let thread = await this.threadRepository.findByTemplateIdAndUserId(
      template.id,
      userId,
    );
    if (!thread) {
      thread = await this.threadRepository.create(userId, template.id);
    }

    //get the template run instruction if exists
    let runInstruction = await this.getTemplateRunInstruction(
      template.id,
      userId,
      workspaceId,
    );

    console.log({ runInstruction });

    // run the assistant with thread id
    let runObject = await this.openAiService.runTemplateAssistant(
      template.openaiAssistantId,
      thread.openAiId,
      runInstruction,
    );

    // save new message
    await this.messageRepository.create(
      runObject.assistantMessage,
      thread.id,
      SenderRole.ASSISTANT,
    );

    return { assistantMessage: runObject.assistantMessage, threadEnd: false };
  }

  async answerTemplateQuestion(
    templateId: number,
    answer: string,
    userId: number,
    workspaceId,
  ) {
    let template = await this.templateRepository.findById(templateId);

    // check if user already has a user template flow "thread"
    // get or create if not
    let thread = await this.threadRepository.findByTemplateIdAndUserId(
      template.id,
      userId,
    );
    if (!thread) {
      throw new UnprocessableEntityException('No thread found for this user');
    }

    // save user message
    await this.messageRepository.create(answer, thread.id, SenderRole.USER);

    let aiResponseObject =
      await this.openAiService.sendTemplateMessageReturnResponse(
        template.openaiAssistantId,
        thread.openAiId,
        answer,
        thread.userId,
      );

    if (aiResponseObject.threadEnd) {
      return {
        assistantMessage: aiResponseObject.assistantMessage,
        threadEnd: true,
      };
    } else {
      // save assistant message
      await this.messageRepository.create(
        aiResponseObject.assistantMessage,
        thread.id,
        SenderRole.ASSISTANT,
      );
      return {
        assistantMessage: aiResponseObject.assistantMessage,
        threadEnd: false,
      };
    }
  }

  private async getTemplateRunInstruction(
    templateId: number,
    userId: number,
    workspaceId: number,
  ) {
    let theTemplate = await this.templateRepository.findById(templateId);
    let templateNeededData = theTemplate.type;

    switch (templateNeededData) {
      case TemplateType.ONBOARDING:
        return '';
      case TemplateType.FUNNEL:
        return await this.getFunnelRunInstruction(userId, workspaceId);
      case TemplateType.TACTIC:
        return '';
      default:
        return '';
    }
  }

  private async getFunnelRunInstruction(userId: number, workspaceId: number) {
    //get workspace data
    let workspaceData;
    if (workspaceId) {
      let workspace = await this.workspaceRepository.findById(workspaceId);
      //if no workspace
      if (!workspace) {
        throw new UnprocessableEntityException('Workspace not found');
      }
      workspaceData = this.serializaWorkspaceData(workspace);
    } else if (workspaceId == null) {
      let userWorkspaces =
        await this.workspaceRepository.findUserWorkspaces(userId);
      workspaceData = this.serializaWorkspaceData(userWorkspaces[0]);
    }
    return workspaceData;
  }

  private serializaWorkspaceData(workspace) {
    let workspaceData = {
      project_name: workspace.name,
      project_goal: workspace.goal,
      project_budget: workspace.budget,
      project_targetGroup: workspace.targetGroup,
      project_marketingLevel: workspace.marketingLevel,
    };
    return workspaceData;
  }
}
