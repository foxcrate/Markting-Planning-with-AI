import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateRepository } from './template.repository';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { MessageService } from 'src/message/message.service';
import { SenderRoleEnum } from 'src/enums/sender-role.enum';
import { ThreadRepository } from 'src/thread/thread.repository';
import { FunnelTemplateDto } from './dtos/funnel-template.dto';
import { WorkspaceRepository } from 'src/workspace/workspace.repository';
import { FunnelService } from 'src/funnel/funnel.service';
import { StageService } from 'src/stage/stage.service';
import { TemplateReturnDto } from './dtos/template-return.dto';
import { NotEndedThreadAiResponseDto } from './dtos/not-ended-thread-ai-response.dto';
import { TemplateCreateDto } from './dtos/template-create.dto';
import { TemplateCategoryService } from 'src/template-category/template-category.service';
import { TemplateUpdateDto } from './dtos/template-update.dto';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    @Inject(forwardRef(() => OpenAiService))
    private readonly openAiService: OpenAiService,
    private readonly messageService: MessageService,
    private readonly threadRepository: ThreadRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly funnelService: FunnelService,
    private readonly stageService: StageService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    private readonly templateCategoryService: TemplateCategoryService,
  ) {}

  async setOnboardingTemplate(template: OnboardingTemplateDto): Promise<any> {
    // check if system has onboarding template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateTypeEnum.ONBOARDING,
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
        TemplateTypeEnum.ONBOARDING,
        description,
        template.parameters,
      );

      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateTypeEnum.ONBOARDING,
        type: TemplateTypeEnum.ONBOARDING,
        description: description,
        example: null,
        maxCharacters: null,
        generatedDocumentsNum: null,
        profilePicture: null,
        categoryId: null,
        parameters: template.parameters,
        requiredData: null,
        openaiAssistantId: existingTemplate.openaiAssistantId,
      });
    }

    let assistance = await this.openAiService.createTemplateAssistance(
      TemplateTypeEnum.ONBOARDING,
      description,
      template.parameters,
    );

    return await this.templateRepository.create({
      name: TemplateTypeEnum.ONBOARDING,
      type: TemplateTypeEnum.ONBOARDING,
      description: description,
      example: null,
      maxCharacters: null,
      generatedDocumentsNum: null,
      profilePicture: null,
      categoryId: null,
      parameters: template.parameters,
      requiredData: null,
      openaiAssistantId: assistance.id,
    });
  }

  async setFunnelTemplate(template: FunnelTemplateDto) {
    // check if system has funnel template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateTypeEnum.FUNNEL,
    );

    if (existingTemplate) {
      await this.openAiService.updateTemplateAssistance(
        existingTemplate.openaiAssistantId,
        TemplateTypeEnum.FUNNEL,
        template.description,
        null,
      );

      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateTypeEnum.FUNNEL,
        type: TemplateTypeEnum.FUNNEL,
        description: template.description,
        example: null,
        maxCharacters: null,
        generatedDocumentsNum: null,
        profilePicture: null,
        categoryId: null,
        parameters: null,
        requiredData: null,
        openaiAssistantId: existingTemplate.openaiAssistantId,
      });
    }

    let assistance = await this.openAiService.createTemplateAssistance(
      TemplateTypeEnum.FUNNEL,
      template.description,
      null,
    );

    return await this.templateRepository.create({
      name: TemplateTypeEnum.FUNNEL,
      type: TemplateTypeEnum.FUNNEL,
      description: template.description,
      example: null,
      maxCharacters: null,
      generatedDocumentsNum: null,
      profilePicture: null,
      categoryId: null,
      parameters: null,
      requiredData: null,
      openaiAssistantId: assistance.id,
    });
  }

  async setTacticTemplate(
    template: FunnelTemplateDto,
  ): Promise<TemplateReturnDto> {
    // check if system has funnel template
    const existingTemplate = await this.templateRepository.findByType(
      TemplateTypeEnum.TACTIC,
    );

    if (existingTemplate) {
      await this.openAiService.updateTemplateAssistance(
        existingTemplate.openaiAssistantId,
        TemplateTypeEnum.TACTIC,
        template.description,
        null,
      );

      return await this.templateRepository.update(existingTemplate.id, {
        name: TemplateTypeEnum.TACTIC,
        type: TemplateTypeEnum.TACTIC,
        description: template.description,
        example: null,
        maxCharacters: null,
        generatedDocumentsNum: null,
        profilePicture: null,
        categoryId: null,
        parameters: null,
        requiredData: null,
        openaiAssistantId: existingTemplate.openaiAssistantId,
      });
    }

    let assistance = await this.openAiService.createTemplateAssistance(
      TemplateTypeEnum.TACTIC,
      template.description,
      null,
    );

    return await this.templateRepository.create({
      name: TemplateTypeEnum.TACTIC,
      type: TemplateTypeEnum.TACTIC,
      description: template.description,
      example: null,
      maxCharacters: null,
      generatedDocumentsNum: null,
      profilePicture: null,
      categoryId: null,
      parameters: null,
      requiredData: null,
      openaiAssistantId: assistance.id,
    });
  }

  async create(templateBody: TemplateCreateDto) {
    // check repeated template name
    let sameNameTemplate = await this.templateRepository.findByName(
      templateBody.name,
    );
    if (sameNameTemplate) {
      throw new UnprocessableEntityException('Template name already exists');
    }

    // validate category id
    await this.templateCategoryService.getOne(templateBody.categoryId);
    let descriptionToBeSaved = templateBody.description;
    templateBody.description = `
      I will pass to you complementary information in a json object in the run instruction.
      ${templateBody.description},
      create ${templateBody.generatedDocumentsNum} of them each with max ${templateBody.maxCharacters} char
      return the output in this format:
      [
      {
      "content",
      "charactersNumber"
      }
      ]
    `;

    let assistance = await this.openAiService.createTemplateAssistance(
      templateBody.name,
      templateBody.description,
      null,
    );

    return await this.templateRepository.create({
      name: templateBody.name,
      type: TemplateTypeEnum.CUSTOM,
      description: descriptionToBeSaved,
      example: templateBody.example,
      maxCharacters: templateBody.maxCharacters,
      generatedDocumentsNum: templateBody.generatedDocumentsNum,
      profilePicture: templateBody.profilePicture,
      parameters: null,
      requiredData: templateBody.requiredData,
      categoryId: templateBody.categoryId,
      openaiAssistantId: assistance.id,
    });
  }

  async update(templateBody: TemplateUpdateDto, templateId: number) {
    // check repeated template name
    if (templateBody.name) {
      let sameNameTemplate = await this.templateRepository.findByName(
        templateBody.name,
      );
      if (sameNameTemplate && sameNameTemplate.id === templateId) {
        throw new UnprocessableEntityException('Template name already exists');
      }
    }

    let theTemplate = await this.getOne(templateId);

    // validate category id
    if (templateBody.categoryId) {
      await this.templateCategoryService.getOne(templateBody.categoryId);
    }
    let descriptionToBeSaved = null;
    if (templateBody.description) {
      descriptionToBeSaved = theTemplate.description;
      templateBody.description = `
      I will pass  to you complementary information in a json object in the run instruction.
      ${templateBody.description},
      create ${templateBody.generatedDocumentsNum ? templateBody.generatedDocumentsNum : theTemplate.generatedDocumentsNum} of them each with max ${templateBody.maxCharacters ? templateBody.maxCharacters : theTemplate.maxCharacters} char
      return the output in this format:
      [
      {
      "content",
      "charactersNumber"
      }
      ]
    `;
    }

    // update openai assistance
    await this.openAiService.updateTemplateAssistance(
      theTemplate.openaiAssistantId,
      templateBody.name ? templateBody.name : theTemplate.name,
      templateBody.description
        ? templateBody.description
        : theTemplate.description,
      null,
    );

    return await this.templateRepository.update(templateId, {
      name: templateBody.name,
      type: TemplateTypeEnum.CUSTOM,
      description: descriptionToBeSaved,
      example: templateBody.example,
      maxCharacters: templateBody.maxCharacters,
      generatedDocumentsNum: templateBody.generatedDocumentsNum,
      profilePicture: templateBody.profilePicture,
      parameters: null,
      requiredData: templateBody.requiredData,
      categoryId: templateBody.categoryId,
      openaiAssistantId: theTemplate.openaiAssistantId,
    });
  }

  async getOne(templateId: number): Promise<TemplateReturnDto> {
    let template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new UnprocessableEntityException('Template not found');
    }
    return template;
  }

  async delete(templateId: number): Promise<TemplateReturnDto> {
    let template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new UnprocessableEntityException('Template not found');
    }

    // delete openai assistance
    let assistance = await this.openAiService.deleteTemplateAssistance(
      template.openaiAssistantId,
    );

    await this.templateRepository.delete(templateId);
    return template;
  }

  async getAll(): Promise<TemplateReturnDto[]> {
    return await this.templateRepository.getAll();
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
      null,
      userId,
      workspaceId,
      funnelId,
      stageId,
    );

    // run the assistant with thread id
    let runObject = await this.openAiService.runBuiltInTemplateAssistant(
      template.openaiAssistantId,
      thread.openAiId,
      runInstruction,
    );

    // save new message
    await this.messageService.create(
      runObject.assistantMessage,
      thread.id,
      SenderRoleEnum.ASSISTANT,
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
    await this.messageService.create(answer, thread.id, SenderRoleEnum.USER);

    //get the template run instruction if exists
    let runInstruction = await this.getTemplateRunInstruction(
      template.id,
      null,
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
      await this.messageService.create(
        aiResponseObject.assistantMessage,
        thread.id,
        SenderRoleEnum.ASSISTANT,
      );
      return {
        assistantMessage: aiResponseObject.assistantMessage,
        threadEnd: false,
      };
    }
  }

  async getTemplateRunInstruction(
    templateId: number,
    documentId: number,
    userId: number,
    workspaceId: number,
    funnelId: number,
    stageId: number,
  ) {
    let theTemplate = await this.templateRepository.findById(templateId);

    switch (theTemplate.type) {
      case TemplateTypeEnum.ONBOARDING:
        return '';
      case TemplateTypeEnum.FUNNEL:
        return await this.getFunnelTemplateRunInstruction(userId, workspaceId);
      case TemplateTypeEnum.TACTIC:
        return await this.getTacticTemplateRunInstruction(
          userId,
          workspaceId,
          funnelId,
          stageId,
        );
      case TemplateTypeEnum.CUSTOM:
        return await this.getCustomTemplateRunInstruction(
          userId,
          templateId,
          documentId,
          workspaceId,
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
      // workspaceData = this.serializeWorkspaceData(workspace);
      workspaceData = workspace.parameters;
    } else if (workspaceId == null) {
      let userWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
      // workspaceData = this.serializeWorkspaceData(userWorkspaces[0]);
      workspaceData = userWorkspaces[0].parameters;
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
      // workspaceData = this.serializeWorkspaceData(workspace);
      workspaceData = workspace.parameters;
    } else if (workspaceId == null) {
      let userWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);

      // workspaceData = this.serializeWorkspaceData(userWorkspaces[0]);
      // console.log('serializedworkspaceData:', workspaceData);
      workspaceData = userWorkspaces[0].parameters;
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

  private async getCustomTemplateRunInstruction(
    userId: number,
    templateId: number,
    documentId: number,
    workspaceId: number,
  ): Promise<any> {
    let theDocument = await this.documentService.getOne(documentId, 0);

    //////////////////////////////get workspace data
    let workspaceData;
    if (workspaceId) {
      let workspace = await this.workspaceRepository.findById(workspaceId);
      //if no workspace
      if (!workspace) {
        throw new UnprocessableEntityException('Workspace not found');
      }
      // workspaceData = this.serializeWorkspaceData(workspace.parameters);
      workspaceData = workspace.parameters;
    } else if (workspaceId == null) {
      let userWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
      // workspaceData = this.serializeWorkspaceData(userWorkspaces[0].parameters);
      workspaceData = userWorkspaces[0].parameters;
    }

    const requiredDataJsonObject = theDocument.requiredData.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {},
    );

    let documentRequiredData = requiredDataJsonObject;

    return {
      ...workspaceData,
      ...documentRequiredData,
    };
  }

  serializeWorkspaceData(workspace) {
    // console.log('workspace:', workspace);

    let workspaceData = {
      project_name: workspace.name,
      project_goal: workspace.goal,
      project_budget: workspace.budget,
      project_targetGroup: workspace.targetGroup,
      project_marketingLevel: workspace.marketingLevel,
    };

    // console.log('workspaceData:', workspaceData);

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
