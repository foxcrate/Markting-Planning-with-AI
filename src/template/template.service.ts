import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateRepository } from './template.repository';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { TemplateType } from 'src/enums/template-type.enum';
import { MessageRepository } from 'src/message/message.repository';
import { SenderRole } from 'src/enums/sender-role.enum';
import { ThreadRepository } from 'src/thread/thread.repository';
import { FunnelTemplateDto } from './dtos/funnel-template.dto';
import { WorkspaceRepository } from 'src/workspace/workspace.repository';
import { FunnelService } from 'src/funnel/funnel.service';
import { StageService } from 'src/stage/stage.service';
import { TemplateReturnDto } from './dtos/template-return.dto';
import { NotEndedThreadAiResponseDto } from './dtos/not-ended-thread-ai-response.dto';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    @Inject(forwardRef(() => OpenAiService))
    private readonly openAiService: OpenAiService,
    private readonly messageRepository: MessageRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly funnelService: FunnelService,
    private readonly stageService: StageService,
  ) {}

  async setOnboardingTemplate(template: OnboardingTemplateDto): Promise<any> {
    // check if system has onboarding template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateType.ONBOARDING,
    );
    // console.log(template.parameters);

    // return await this.openAiService.getOnboardingParametersName();

    let description =
      'Start the conversation by greeting the user and saying who are you.\n' +
      template.description +
      '\n Collect the data step by step. When you collect this data, call the end_onboarding_flow function';

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

  async setTacticTemplate(
    template: FunnelTemplateDto,
  ): Promise<TemplateReturnDto> {
    // check if system has funnel template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateType.TACTIC,
    );

    if (existingTemplate) {
      await this.openAiService.updateTemplateAssistance(
        existingTemplate.openaiAssistantId,
        TemplateType.TACTIC,
        template.description,
        null,
      );

      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateType.TACTIC,
        type: TemplateType.TACTIC,
        description: template.description,
        parameters: null,
        openaiAssistantId: existingTemplate.openaiAssistantId,
      });
    }

    let assistance = await this.openAiService.createTemplateAssistance(
      TemplateType.TACTIC,
      template.description,
      null,
    );

    return await this.templateRepository.create({
      name: TemplateType.TACTIC,
      type: TemplateType.TACTIC,
      description: template.description,
      parameters: null,
      openaiAssistantId: assistance.id,
    });
  }

  async getOne(templateId: number): Promise<TemplateReturnDto> {
    let template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new UnprocessableEntityException('Template not found');
    }
    return template;
  }

  async getOneByType(type: string): Promise<TemplateReturnDto> {
    let template = await this.templateRepository.findByType(type);
    if (!template) {
      throw new UnprocessableEntityException('Template not found');
    }
    return template;
  }

  async startTemplateFlow(
    templateId: number,
    userId: number,
    workspaceId: number,
    funnelId: number,
    stageId: number,
  ): Promise<NotEndedThreadAiResponseDto> {
    let template = await this.templateRepository.findById(templateId);

    // check if user already has a user template flow "thread"
    // get or create if not
    let thread = await this.threadRepository.findActiveByTemplateIdAndUserId(
      template.id,
      userId,
    );
    if (!thread) {
      let openAiThread = await this.openAiService.createUserThread();
      thread = await this.threadRepository.create(
        userId,
        template.id,
        openAiThread.id,
      );
    }

    //get the template run instruction if exists
    let runInstruction = await this.getTemplateRunInstruction(
      template.id,
      userId,
      workspaceId,
      funnelId,
      stageId,
    );

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
    workspaceId: number,
    funnelId: number,
    stageId: number,
  ): Promise<NotEndedThreadAiResponseDto> {
    let template = await this.templateRepository.findById(templateId);

    // check if user already has a user template flow "thread"
    // get or create if not
    let thread = await this.threadRepository.findActiveByTemplateIdAndUserId(
      template.id,
      userId,
    );
    if (!thread) {
      throw new UnprocessableEntityException('No thread found for this user');
    }

    // save user message
    await this.messageRepository.create(answer, thread.id, SenderRole.USER);

    //get the template run instruction if exists
    let runInstruction = await this.getTemplateRunInstruction(
      template.id,
      userId,
      workspaceId,
      funnelId,
      stageId,
    );

    let aiResponseObject =
      await this.openAiService.sendTemplateMessageReturnResponse(
        template.openaiAssistantId,
        thread.openAiId,
        answer,
        thread.userId,
        runInstruction,
        null,
        funnelId,
        stageId,
      );

    // console.log({ aiResponseObject });

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
    funnelId: number,
    stageId: number,
  ) {
    let theTemplate = await this.templateRepository.findById(templateId);

    switch (theTemplate.type) {
      case TemplateType.ONBOARDING:
        return '';
      case TemplateType.FUNNEL:
        return await this.getFunnelTemplateRunInstruction(userId, workspaceId);
      case TemplateType.TACTIC:
        return await this.getTacticTemplateRunInstruction(
          userId,
          workspaceId,
          funnelId,
          stageId,
        );
      default:
        return '';
    }
  }

  private async getFunnelTemplateRunInstruction(
    userId: number,
    workspaceId: number,
  ) {
    //get workspace data
    let workspaceData;

    if (workspaceId) {
      let workspace = await this.workspaceRepository.findById(workspaceId);

      //if no workspace
      if (!workspace) {
        throw new UnprocessableEntityException('Workspace not found');
      }
      workspaceData = this.serializeWorkspaceData(workspace);
    } else if (workspaceId == null) {
      let userWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
      workspaceData = this.serializeWorkspaceData(userWorkspaces[0]);
    }
    return workspaceData;
  }

  private async getTacticTemplateRunInstruction(
    userId: number,
    workspaceId: number,
    funnelId: number,
    stageId: number,
  ): Promise<{ project_data: any; funnel_data: any; stage_data: any }> {
    if (!funnelId || !stageId) {
      throw new UnprocessableEntityException(
        'Please provide funnel and stage id',
      );
    }
    let runInstruction: any;
    //////////////////////////////get workspace data
    let workspaceData;
    if (workspaceId) {
      let workspace = await this.workspaceRepository.findById(workspaceId);
      //if no workspace
      if (!workspace) {
        throw new UnprocessableEntityException('Workspace not found');
      }
      workspaceData = this.serializeWorkspaceData(workspace);
    } else if (workspaceId == null) {
      let userWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
      workspaceData = this.serializeWorkspaceData(userWorkspaces[0]);
    }
    let project_data = workspaceData;

    ////////////////////////////////get funnel data
    let funnelData;
    let funnel = await this.funnelService.getOne(funnelId, userId);
    //if no funnel
    if (!funnel) {
      throw new UnprocessableEntityException('Funnel not found');
    }
    funnelData = this.serializeFunnelData(funnel);
    let funnel_data = funnelData;

    ////////////////////////////////get stage data
    let stageData;
    let stage = await this.stageService.getOne(stageId, funnel.userId, userId);
    //if no stage
    if (!stage) {
      throw new UnprocessableEntityException('Stage not found');
    }
    stageData = this.serializeStageData(stage);
    let stage_data = stageData;

    return {
      project_data: project_data,
      funnel_data: funnel_data,
      stage_data: stage_data,
    };
  }

  private serializeWorkspaceData(workspace) {
    let workspaceData = {
      project_name: workspace.name,
      project_goal: workspace.goal,
      project_budget: workspace.budget,
      project_targetGroup: workspace.targetGroup,
      project_marketingLevel: workspace.marketingLevel,
    };
    return workspaceData;
  }

  private serializeFunnelData(funnel) {
    let funnelData = {
      funnel_name: funnel.name,
      funnel_description: funnel.description,
    };
    return funnelData;
  }

  private serializeStageData(stage) {
    let stageData = {
      stage_name: stage.name,
      stage_description: stage.description,
    };
    return stageData;
  }
}
