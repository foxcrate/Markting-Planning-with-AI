import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { FunnelService } from 'src/funnel/funnel.service';
import { ParameterObjectDto } from 'src/template/dtos/parameter-object.dto';
import { ThreadService } from 'src/thread/thread.service';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { CreateAiTacticDto } from './dtos/create-ai-tactic.dto';
import { StageService } from 'src/stage/stage.service';
import { WorkspaceReturnDto } from 'src/workspace/dtos/workspace-return.dto';
import { ConfigService } from '@nestjs/config';
import { SerializedDataObjectDto } from './dtos/serializedDataObject.dto';
import { AiCreatedTacticDto } from './dtos/ai-created-tactic.dto';
import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { TemplateService } from 'src/template/template.service';
import { AiChatRequestDto } from './dtos/ai-chat-request.dto';
import { ThreadReturnDto } from 'src/thread/dtos/thread-return.dto';
import { SenderRoleEnum } from 'src/enums/sender-role.enum';
import { MessageService } from 'src/message/message.service';
import { AiChatResponseDto } from './dtos/ai-chat-response.dto';
import { UserService } from 'src/user/user.service';
import { GlobalStageService } from 'src/global-stage/global-stage.service';
import { KpiReturnDto } from 'src/kpi/dtos/return.dto';
import { WorkspaceRepository } from 'src/workspace/workspace.repository';
import { AssistantCreateParams } from 'openai/resources/beta/assistants';

@Injectable()
export class OpenAiService implements OnModuleInit {
  constructor(
    private workspaceService: WorkspaceService,
    private workspaceRepository: WorkspaceRepository,
    private funnelService: FunnelService,
    private threadService: ThreadService,
    private messageService: MessageService,
    private globalStageService: GlobalStageService,
    private userService: UserService,
    private stageService: StageService,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    private configService: ConfigService,
  ) {}
  public instance: OpenAI;
  public getInstance(): OpenAI {
    if (!this.instance) {
      this.instance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.instance;
  }

  async onModuleInit() {
    this.instance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async aiCreateTactic(body: CreateAiTacticDto, userId: number): Promise<any> {
    let serializedUserDataObject = await this.getFunctionalAiUserData(
      body.library,
      body.workspaceId,
      body.funnelId,
      body.stageId,
      userId,
    );

    // console.log(JSON.stringify(serializedUserDataObject));

    try {
      let aiResponse = await this.runFunctionalAssistant(
        this.configService.getOrThrow('CREATE_ONE_TACTIC_ASSISTANT_ID'),
        serializedUserDataObject,
        body.prompt,
        body.workspaceId,
        body.funnelId,
        body.stageId,
        userId,
      );
      return aiResponse;
    } catch (error: any) {
      console.log('---------- create ai tactic error -----------');

      console.log(error.message);

      throw new ServiceUnavailableException(error.code);
    }
  }

  async aiChat(
    body: AiChatRequestDto,
    userId: number,
  ): Promise<AiChatResponseDto> {
    //get user chat thread
    let theThread = {} as ThreadReturnDto;
    if (!body.threadId) {
      let openAiThread = await this.createUserThread();
      let newThread = await this.threadService.create(
        userId,
        null,
        openAiThread.id,
      );
      theThread = newThread;
    } else {
      theThread = await this.threadService.getOne(body.threadId, userId);
    }
    //save user message
    await this.messageService.create(
      body.message,
      theThread.id,
      SenderRoleEnum.USER,
    );

    let serializedUserDataObject = await this.getFunctionalAiUserData(
      null,
      body.workspaceId,
      body.funnelId,
      body.stageId,
      userId,
    );

    //get user data
    let theUser = await this.userService.getUserData(userId);

    let newSerializedUserDataObject = {
      user_data: { user_name: theUser.firstName + ' ' + theUser.lastName },
      ...serializedUserDataObject,
    };

    try {
      let aiResponse = await this.chatAssistant(
        this.configService.getOrThrow('CHAT_ASSISTANT_ID'),
        newSerializedUserDataObject,
        body.message,
        theThread.id,
        theThread.openAiId,
      );

      return aiResponse;
    } catch (error: any) {
      console.log('---------- create ai tactic error -----------');

      console.log(error.message);

      throw new ServiceUnavailableException(error.code);
    }
  }

  async chatAssistant(
    openaiAssistantId: string,
    runInstructions: SerializedDataObjectDto,
    message: string,
    threadId: number,
    threadOpenAiId: string,
  ): Promise<AiChatResponseDto> {
    //add "(reply to me in html format)" after the message

    message = message + ' (reply to me in html format)';

    await this.instance.beta.threads.messages.create(threadOpenAiId, {
      role: 'user',
      content: message,
    });

    //start the assistant with the thread and run instructions

    let run = await this.instance.beta.threads.runs.create(threadOpenAiId, {
      assistant_id: openaiAssistantId,
      additional_instructions: JSON.stringify(runInstructions),
    });

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await this.instance.beta.threads.runs.retrieve(
        run.thread_id,
        run.id,
      );
    }

    if (run.status === 'completed') {
      const messages: any = await this.instance.beta.threads.messages.list(
        run.thread_id,
      );

      let aiMessage = messages.data[0].content[0].text.value;

      //save ai message
      await this.messageService.create(
        aiMessage,
        threadId,
        SenderRoleEnum.ASSISTANT,
      );

      return {
        message: aiMessage,
        threadId: threadId,
      };
    } else {
      console.log('error in openAI chat run:', run.status);

      throw new ServiceUnavailableException('OpenAI API Error');
    }
  }

  async getFunctionalAiUserData(
    library: boolean,
    workspaceId: number,
    funnelId: number,
    stageId: number,
    userId: number,
  ): Promise<SerializedDataObjectDto> {
    let theWorkspace: WorkspaceReturnDto;
    if (workspaceId == 0) {
      let userWorkspaces =
        await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
      theWorkspace = userWorkspaces[0];
      if (!theWorkspace) {
        throw new NotFoundException('User has no workspaces');
      }
    } else {
      theWorkspace = await this.workspaceRepository.findById(workspaceId);
      //if no workspace
      if (!theWorkspace) {
        throw new UnprocessableEntityException('Workspace not found');
      }
    }

    // console.log('workspace:', theWorkspace);

    let theFunnel: any;
    let theStage: any;
    let theFunnelStages: any;

    if (library === false || library === null) {
      if (!funnelId) {
        theFunnel = {
          name: null,
          description: null,
        };
        theFunnelStages = null;
      } else {
        theFunnel = await this.funnelService.getOne(funnelId, userId);

        theFunnelStages = await this.globalStageService.getAll();
      }

      if (!stageId) {
        theStage = {
          name: null,
          description: null,
          tactics: null,
        };
      } else {
        theStage = await this.stageService.getOne(
          stageId,
          theFunnel.id,
          userId,
        );
        theStage = {
          name: theStage.name,
          description: theStage.description,
          tactics: theStage.tactics,
        };
      }
    } else if (library === true) {
      theFunnel = {
        name: null,
        description: null,
      };
      theFunnelStages = null;

      // get the global stage
      theStage = await this.globalStageService.getOne(stageId);
      if (!theStage) {
        throw new NotFoundException('global-stage not found');
      }

      theStage = {
        name: theStage.name,
        description: theStage.description,
        tactics: null,
      };
    }

    let serializedReturnObject = {
      project_data: theWorkspace.parameters,
      funnel_data: {
        name: theFunnel.name,
        description: theFunnel.description,
        funnel_stages: theFunnelStages,
      },
      stage_data: {
        name: theStage.name,
        description: theStage.description,
        stage_tactics: theStage.tactics,
      },
    };
    return serializedReturnObject;
  }

  async createTemplateAssistance(
    name: string,
    description: string,
    functionParameters: ParameterObjectDto[],
  ): Promise<OpenAI.Beta.Assistants.Assistant> {
    let templateAssistantObject: AssistantCreateParams;

    if (functionParameters) {
      let functionsParametersObject =
        this.createFunctionParametersObject(functionParameters);

      let parametersArray = this.createParametersArray(functionParameters);

      templateAssistantObject = {
        name: name,
        instructions: description,
        model: 'gpt-4o-mini',
        tools: [
          {
            type: 'function',
            function: {
              name: 'end_onboarding_flow',
              description:
                'function will be called when the assistant collect the desired parameters',
              parameters: {
                type: 'object',
                properties: functionsParametersObject,
                required: parametersArray,
              },
            },
          },
        ],
      };
    } else {
      templateAssistantObject = {
        name: name,
        instructions: description,
        model: 'gpt-4o-mini',
      };
    }

    const assistant = await this.instance.beta.assistants.create(
      templateAssistantObject,
    );

    return assistant;
  }

  async updateTemplateAssistance(
    assistantId: string,
    name: string,
    description: string,
    functionParameters: ParameterObjectDto[],
  ) {
    let templateAssistantObject: AssistantCreateParams;
    if (functionParameters) {
      let functionsParametersObject =
        this.createFunctionParametersObject(functionParameters);

      let parametersArray = this.createParametersArray(functionParameters);

      templateAssistantObject = {
        name: name,
        instructions: description,
        model: 'gpt-4o-mini',
        tools: [
          {
            type: 'function',
            function: {
              name: 'end_onboarding_flow',
              description:
                'function will be called when the assistant collect the desired parameters',
              parameters: {
                type: 'object',
                properties: functionsParametersObject,
                required: parametersArray,
              },
            },
          },
        ],
      };
    } else {
      templateAssistantObject = {
        name: name,
        instructions: description,
        model: 'gpt-4o-mini',
      };
    }

    const assistant = await this.instance.beta.assistants.update(
      assistantId,
      templateAssistantObject,
    );

    return assistant;
  }

  async deleteTemplateAssistance(assistantId: string) {
    const assistant = await this.instance.beta.assistants.del(assistantId);

    return assistant;
  }

  async runBuiltInTemplateAssistant(
    openaiAssistantId: string,
    threadOpenaiId: string,
    runInstructions: string,
  ): Promise<{
    assistantMessage: string;
    threadEnd: boolean;
  }> {
    let run = await this.instance.beta.threads.runs.create(threadOpenaiId, {
      assistant_id: openaiAssistantId,
      additional_instructions: JSON.stringify(runInstructions),
    });

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await this.instance.beta.threads.runs.retrieve(
        run.thread_id,
        run.id,
      );
    }

    if (run.status === 'completed') {
      const messages: any = await this.instance.beta.threads.messages.list(
        run.thread_id,
      );

      return {
        assistantMessage: messages.data[0].content[0].text.value,
        threadEnd: false,
      };
    } else {
      console.log('error in openAI chat run:', run.status);

      throw new ServiceUnavailableException('OpenAI API Error');
    }
  }

  async runDocumentTemplateAssistant(
    openaiAssistantId: string,
    threadOpenaiId: string,
    runInstructions: string,
  ): Promise<{
    assistantMessage: string;
    threadEnd: boolean;
  }> {
    let run = await this.instance.beta.threads.runs.create(threadOpenaiId, {
      assistant_id: openaiAssistantId,
      additional_instructions: JSON.stringify(runInstructions),
    });

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await this.instance.beta.threads.runs.retrieve(
        run.thread_id,
        run.id,
      );
    }

    if (run.status === 'completed') {
      const messages: any = await this.instance.beta.threads.messages.list(
        run.thread_id,
      );

      return {
        assistantMessage: messages.data[0].content[0].text.value,
        threadEnd: true,
      };
    } else {
      console.log('error in openAI chat run:', run.status);

      throw new ServiceUnavailableException('OpenAI API Error');
    }
  }

  async runFunctionalAssistant(
    openaiAssistantId: string,
    runInstructions: SerializedDataObjectDto,
    prompt: string,
    workspaceId: number,
    funnelId: number,
    stageId: number,
    userId: number,
  ) {
    let openAiThread = await this.createUserThread();
    let theThread = await this.threadService.create(
      userId,
      null,
      openAiThread.id,
    );

    let run = await this.instance.beta.threads.runs.create(theThread.openAiId, {
      assistant_id: openaiAssistantId,
      additional_instructions: JSON.stringify({
        ...runInstructions,
        prompt: prompt,
      }),
    });

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await this.instance.beta.threads.runs.retrieve(
        run.thread_id,
        run.id,
      );
    }

    if (run.status === 'completed') {
      const messages: any = await this.instance.beta.threads.messages.list(
        run.thread_id,
      );

      return {
        assistantMessage: messages.data[0].content[0].text.value,
        threadEnd: false,
      };
    } else if (run.status === 'requires_action') {
      let assistantMessage = null;
      switch (
        run.required_action.submit_tool_outputs.tool_calls[0].function.name
      ) {
        case 'add_tactic_to_workspace':
          console.log('-- add_tactic_to_workspace --');

          let aiCratedObject = JSON.parse(
            run.required_action.submit_tool_outputs.tool_calls[0].function
              .arguments,
          );

          // console.log(aiCratedObject);

          // if (
          //   !aiCratedObject ||
          //   !aiCratedObject.tactic ||
          //   Object.keys(aiCratedObject).length === 0 ||
          //   Object.keys(aiCratedObject.tactic).length === 0
          // )
          if (!aiCratedObject || Object.keys(aiCratedObject).length === 0) {
            console.log('-- empty object from openai --');

            throw new ServiceUnavailableException('OpenAI API Error');
          }

          assistantMessage = this.addTacticToWorkspaceHandler(
            prompt,
            runInstructions,
            // aiCratedObject.tactic,
            aiCratedObject,
          );

          await this.threadService.finishTemplateThread(theThread.openAiId);
          return {
            assistantMessage: assistantMessage,
            threadEnd: true,
          };
      }
    } else {
      console.log('error in openAI chat run:', run.status);

      throw new ServiceUnavailableException('OpenAI API Error');
    }
  }

  async sendTemplateMessageReturnResponse(
    assistantOpenaiId: string,
    threadOpenaiId: string,
    message: string,
    userId: number,
    runInstructions: string,
    workspaceId: number,
    funnelId: number,
    stageId: number,
  ): Promise<{
    assistantMessage: any;
    threadEnd: boolean;
  }> {
    // console.log({ runInstructions });

    await this.instance.beta.threads.messages.create(threadOpenaiId, {
      role: 'user',
      content: message,
    });
    let run = await this.instance.beta.threads.runs.create(threadOpenaiId, {
      assistant_id: assistantOpenaiId,
      additional_instructions: JSON.stringify(runInstructions),
    });

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await this.instance.beta.threads.runs.retrieve(
        run.thread_id,
        run.id,
      );
    }

    if (run.status === 'completed') {
      const messages: any = await this.instance.beta.threads.messages.list(
        run.thread_id,
      );

      return {
        assistantMessage: messages.data[0].content[0].text.value,
        threadEnd: false,
      };
    } else if (run.status === 'requires_action') {
      let assistantMessage = null;
      switch (
        run.required_action.submit_tool_outputs.tool_calls[0].function.name
      ) {
        case 'end_onboarding_flow':
          assistantMessage = await this.endOnboardingFlowFunctionCallHandler(
            run,
            userId,
          );

          await this.threadService.finishTemplateThread(threadOpenaiId);
          return {
            assistantMessage: assistantMessage,
            threadEnd: true,
          };
        case 'add_tactics_to_workspace':
          assistantMessage = await this.createStageTacticsFunctionCallHandler(
            run,
            userId,
            null,
            funnelId,
            stageId,
          );

          await this.threadService.finishTemplateThread(threadOpenaiId);
          return {
            assistantMessage: assistantMessage,
            threadEnd: true,
          };
      }
    } else {
      console.log('error in openAI chat run:', run.status);

      throw new ServiceUnavailableException('OpenAI API Error');
    }
  }

  async sendMessageReturnResponse(
    threadId: string,
    message: string,
  ): Promise<{ message: string; threadId: string }> {
    await this.instance.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
    let run = await this.instance.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
    });

    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await this.instance.beta.threads.runs.retrieve(
        run.thread_id,
        run.id,
      );
    }

    if (run.status === 'completed') {
      const messages: any = await this.instance.beta.threads.messages.list(
        run.thread_id,
      );

      return {
        message: messages.data[0].content[0].text.value,
        threadId: threadId,
      };
    } else {
      console.log('error in openAI chat run:', run.status);

      throw new ServiceUnavailableException('OpenAI API Error');
    }
  }

  async createUserThread() {
    const thread = await this.instance.beta.threads.create();
    return thread;
  }

  private addTacticToWorkspaceHandler(
    prompt: string,
    runInstructions: SerializedDataObjectDto,
    aiCreatedTactic: any,
  ): AiCreatedTacticDto {
    let kpis: KpiReturnDto[] = [];
    if (aiCreatedTactic.kpi_name) {
      kpis.push({
        id: null,
        name: aiCreatedTactic.kpi_name,
        unit: aiCreatedTactic.kpi_unit,
        kpiMeasuringFrequency: aiCreatedTactic.kpi_measuring_frequency,
        tacticId: null,
        kpi_entries: null,
      });
    }

    let steps = [];

    if (aiCreatedTactic.steps_to_achieve_the_tactic) {
      steps = aiCreatedTactic.steps_to_achieve_the_tactic;
    }

    return {
      prompt: prompt,
      name: aiCreatedTactic.name,
      stageName: runInstructions.stage_data.name,
      description: aiCreatedTactic.description,
      theOrder: aiCreatedTactic.theOrder,
      kpis: kpis,
      steps: steps,
    };
  }

  private createFunctionParametersObject(
    functionParameters: ParameterObjectDto[],
  ) {
    const objectStructure = functionParameters.reduce(
      (object, functionParameter) => {
        object[functionParameter.name] = {
          type: functionParameter.type,
          description: functionParameter.description,
        };
        return object;
      },
      {},
    );

    return objectStructure;
  }

  private createParametersArray(functionParameters: ParameterObjectDto[]) {
    return functionParameters.map((functionParameter) => {
      return functionParameter.name;
    });
  }

  private async endOnboardingFlowFunctionCallHandler(run, userId) {
    console.log('------- endFlowFunctionCallHandler ------');
    let functionReturnJsonObject = JSON.parse(
      run.required_action.submit_tool_outputs.tool_calls[0].function.arguments,
    );

    if (!(await this.workspaceService.userHasConfirmedWorkspace(userId))) {
      let createdObject = await this.workspaceService.create(
        functionReturnJsonObject,
        userId,
      );
      await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);
      return {
        keys: await this.getOnboardingParametersName(),
        wholeObject: createdObject.parameters,
      };
    }

    await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);

    throw new UnprocessableEntityException(
      'User has already created a workspace',
    );
  }

  async getOnboardingParametersName() {
    let onboardingTemplate = await this.templateService.getOneByType(
      TemplateTypeEnum.ONBOARDING,
    );
    let onboardingParameters = onboardingTemplate.parameters;
    // console.log(onboardingParameters);

    let onboardingParametersNames = onboardingParameters.map(
      (parameter) => parameter.name,
    );
    return onboardingParametersNames;
  }

  private async createStageTacticsFunctionCallHandler(
    run: any,
    userId: number,
    workspaceId: number,
    funnelId: number,
    stageId: number,
  ) {
    console.log('------- createStageTacticsFunctionCallHandler ------');
    let functionReturnJsonObject = JSON.parse(
      run.required_action.submit_tool_outputs.tool_calls[0].function.arguments,
    );

    // console.log(JSON.stringify(functionReturnJsonObject));

    if (
      !Array.isArray(functionReturnJsonObject.tactics) ||
      functionReturnJsonObject.tactics.length == 0
    ) {
      console.log(
        'Error in Assistant function call response: created tactics array are empty',
      );

      console.log(functionReturnJsonObject);
      throw new ServiceUnavailableException(
        'Error in Assistant function call response',
      );
    }

    //delete past stages tactics

    // await this.tacticService.addAssistantTacticsToStage(
    //   stageId,
    //   functionReturnJsonObject.tactics,
    // );

    await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);
    return functionReturnJsonObject.tactics;
  }
}
