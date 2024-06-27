import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
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
import { TemplateType } from 'src/enums/template-type.enum';
import { TemplateService } from 'src/template/template.service';
import { AiChatRequestDto } from './dtos/ai-chat-request.dto';
import { ThreadReturnDto } from 'src/thread/dtos/thread-return.dto';
import { SenderRole } from 'src/enums/sender-role.enum';
import { MessageService } from 'src/message/message.service';
import { AiChatResponseDto } from './dtos/ai-chat-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OpenAiService implements OnModuleInit {
  constructor(
    private workspaceService: WorkspaceService,
    private funnelService: FunnelService,
    private threadService: ThreadService,
    private messageService: MessageService,
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
      body.workspaceId,
      body.funnelId,
      body.stageId,
      userId,
    );

    // console.log({
    //   serializedUserDataObject,
    // });

    return await this.runFunctionalAssistant(
      this.configService.getOrThrow('CREATE_ONE_TACTIC_ASSISTANT_ID'),
      serializedUserDataObject,
      body.prompt,
      body.workspaceId,
      body.funnelId,
      body.stageId,
      userId,
    );
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
      SenderRole.USER,
    );

    let serializedUserDataObject = await this.getFunctionalAiUserData(
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

    // console.log({
    //   newSerializedUserDataObject,
    // });

    return await this.chatAssistant(
      this.configService.getOrThrow('CHAT_ASSISTANT_ID'),
      newSerializedUserDataObject,
      body.message,
      theThread.id,
      theThread.openAiId,
    );
  }

  async chatAssistant(
    openaiAssistantId: string,
    runInstructions: SerializedDataObjectDto,
    message: string,
    threadId: number,
    threadOpenAiId: string,
  ): Promise<AiChatResponseDto> {
    //start the assistant with the thread and run instructions
    await this.instance.beta.threads.messages.create(threadOpenAiId, {
      role: 'user',
      content: message,
    });
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
        SenderRole.ASSISTANT,
      );

      return {
        message: aiMessage,
        threadId: threadId,
      };
    } else {
      console.log(run.status);
      throw new UnprocessableEntityException(
        `error in openAI chat run: ${run.status}`,
      );
    }
  }

  async getFunctionalAiUserData(
    workspaceId: number,
    funnelId: number,
    stageId: number,
    userId: number,
  ): Promise<SerializedDataObjectDto> {
    let theWorkspace: WorkspaceReturnDto;
    if (workspaceId == 0) {
      let userWorkspaces =
        await this.workspaceService.userConfirmedWorkspace(userId);
      theWorkspace = userWorkspaces[0];
      if (!theWorkspace) {
        throw new NotFoundException('User has no workspaces');
      }
    } else {
      theWorkspace = await this.workspaceService.getOne(workspaceId, userId);
    }

    let theFunnel: any;
    if (!funnelId) {
      theFunnel = {
        name: null,
        description: null,
      };
    } else {
      theFunnel = await this.funnelService.getOne(funnelId, userId);
    }

    let theStage: any;
    if (!stageId) {
      theStage = {
        name: null,
        description: null,
        tactics: null,
      };
    } else {
      theStage = await this.stageService.getOne(
        stageId,
        theFunnel.userId,
        userId,
      );
    }

    let serializedReturnObject = {
      project_data: theWorkspace.parameters,
      funnel_data: {
        name: theFunnel.name,
        description: theFunnel.description,
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
        model: 'gpt-3.5-turbo',
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
        model: 'gpt-3.5-turbo',
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
        model: 'gpt-3.5-turbo',
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
        model: 'gpt-3.5-turbo',
      };
    }

    const assistant = await this.instance.beta.assistants.update(
      assistantId,
      templateAssistantObject,
    );

    return assistant;
  }

  async runTemplateAssistant(
    openaiAssistantId: string,
    threadOpenaiId: string,
    runInstructions: string,
  ): Promise<{
    assistantMessage: string;
    threadEnd: boolean;
  }> {
    // console.log({
    //   runInstructions,
    // });

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
      console.log(JSON.stringify(run));
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
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

          if (workspaceId === null || funnelId === null || stageId === null) {
            throw new UnprocessableEntityException(
              'workspaceId and funnelId and stageId is required',
            );
          }

          let aiCratedObject = JSON.parse(
            run.required_action.submit_tool_outputs.tool_calls[0].function
              .arguments,
          );

          if (
            Object.keys(aiCratedObject).length === 0 &&
            Object.keys(aiCratedObject.tactic).length === 0
          ) {
            console.log('-- empty object from openai --');

            throw new UnprocessableEntityException(
              `error in openAI run:  ${run.status}`,
            );
          }

          // console.log(aiCratedObject);

          assistantMessage = await this.addTacticToWorkspaceHandler(
            aiCratedObject.tactic,
          );

          await this.threadService.finishTemplateThread(theThread.openAiId);
          return {
            assistantMessage: assistantMessage,
            threadEnd: true,
          };
      }
    } else {
      console.log(run);
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
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
      // console.log('---- run in complete-----');

      // console.log(run);

      // console.log('---------');

      // console.log(
      //   run.required_action.submit_tool_outputs.tool_calls[0].function,
      // );

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
        // case 'add_funnel_stages_to_my_workspace':
        //   assistantMessage = await this.createFunnelFunctionCallHandler(
        //     run,
        //     userId,
        //   );

        //   await this.threadService.finishTemplateThread(threadOpenaiId);
        //   return {
        //     assistantMessage: assistantMessage,
        //     threadEnd: true,
        //   };
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
      console.log(run);
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
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
      console.log(run.status);
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
    }
  }

  async createUserThread() {
    const thread = await this.instance.beta.threads.create();
    return thread;
  }

  private async addTacticToWorkspaceHandler(
    aiCreatedTactic: any,
  ): Promise<AiCreatedTacticDto> {
    //return serialized tactic
    return {
      name: aiCreatedTactic.name,
      description: aiCreatedTactic.description,
      theOrder: aiCreatedTactic.theOrder,
      kpiName: aiCreatedTactic.kpi_name,
      kpiUnit: aiCreatedTactic.kpi_unit,
      kpiMeasuringFrequency: aiCreatedTactic.kpi_measuring_frequency,
      steps: aiCreatedTactic.steps_to_achieve_the_tactic,
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
      TemplateType.ONBOARDING,
    );
    let onboardingParameters = onboardingTemplate.parameters;
    // console.log(onboardingParameters);

    let onboardingParametersNames = onboardingParameters.map(
      (parameter) => parameter.name,
    );
    return onboardingParametersNames;
  }

  // private async createFunnelFunctionCallHandler(run, userId) {
  //   console.log('------- createFunnelFunctionCallHandler ------');
  //   let functionReturnJsonObject = JSON.parse(
  //     run.required_action.submit_tool_outputs.tool_calls[0].function.arguments,
  //   );

  //   if (
  //     !Array.isArray(functionReturnJsonObject.stages) ||
  //     functionReturnJsonObject.stages.length == 0
  //   ) {
  //     console.log(functionReturnJsonObject);
  //     throw new UnprocessableEntityException(
  //       'Error in Assistant function call response',
  //     );
  //   }

  //   if (await this.funnelService.userHasAssistantFunnel(userId)) {
  //     await this.funnelService.updateAssistantFunnel(
  //       functionReturnJsonObject.stages,
  //       userId,
  //     );
  //   } else {
  //     await this.funnelService.createAssistantFunnel(
  //       functionReturnJsonObject.stages,
  //       userId,
  //     );
  //   }

  //   await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);
  //   return functionReturnJsonObject;
  // }

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
      console.log(functionReturnJsonObject);
      throw new UnprocessableEntityException(
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
