import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { AssistantCreateParams } from 'openai/resources/beta/assistants/assistants';
import { FunnelService } from 'src/funnel/funnel.service';
import { ParameterObjectDto } from 'src/template/dtos/parameter-object.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class OpenAiService implements OnModuleInit {
  constructor(
    private workspaceService: WorkspaceService,
    private funnelService: FunnelService,
  ) {}
  public instance: OpenAI;
  public getInstance(): OpenAI {
    if (!this.instance) {
      console.log('alo');
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
              name: 'end_flow',
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
              name: 'end_flow',
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
    threadOpenaiId: string;
    assistantOpenaiId: string;
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
        threadOpenaiId: run.thread_id,
        assistantOpenaiId: run.assistant_id,
        threadEnd: false,
      };
    } else {
      console.log(JSON.stringify(run));
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
  ): Promise<{
    assistantMessage: string;
    threadOpenaiId: string;
    assistantOpenaiId: string;
    threadEnd: boolean;
  }> {
    await this.instance.beta.threads.messages.create(threadOpenaiId, {
      role: 'user',
      content: message,
    });
    let run = await this.instance.beta.threads.runs.create(threadOpenaiId, {
      assistant_id: assistantOpenaiId,
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
        threadOpenaiId: run.thread_id,
        assistantOpenaiId: run.assistant_id,
        threadEnd: false,
      };
    } else if (run.status === 'requires_action') {
      switch (
        run.required_action.submit_tool_outputs.tool_calls[0].function.name
      ) {
        case 'end_flow':
          return await this.endFlowFunctionCallHandler(run, userId);
        case 'add_funnel_stages_to_my_workspace':
          return await this.createFunnelFunctionCallHandler(run, userId);
        default:
          return {
            assistantMessage: 'done',
            threadOpenaiId: run.thread_id,
            assistantOpenaiId: run.assistant_id,
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

  private async endFlowFunctionCallHandler(run, userId) {
    console.log('------- endFlowFunctionCallHandler ------');
    let functionReturnJsonObject = JSON.parse(
      run.required_action.submit_tool_outputs.tool_calls[0].function.arguments,
    );
    if (!(await this.workspaceService.userHasWorkspace(userId))) {
      await this.workspaceService.create(functionReturnJsonObject, userId);
      await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);
      return {
        assistantMessage: functionReturnJsonObject,
        threadOpenaiId: run.thread_id,
        assistantOpenaiId: run.assistant_id,
        threadEnd: true,
      };
    }

    await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);

    throw new UnprocessableEntityException(
      'User has already created a workspace',
    );
  }

  private async createFunnelFunctionCallHandler(run, userId) {
    console.log('------- createFunnelFunctionCallHandler ------');
    let functionReturnJsonObject = JSON.parse(
      run.required_action.submit_tool_outputs.tool_calls[0].function.arguments,
    );
    console.log(run);

    console.log(functionReturnJsonObject);

    if (await this.funnelService.userHasAssistantFunnel(userId)) {
      await this.funnelService.updateAssistantFunnel(
        functionReturnJsonObject,
        userId,
      );
    } else {
      await this.funnelService.createAssistantFunnel(
        functionReturnJsonObject,
        userId,
      );
    }

    await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);
    return {
      assistantMessage: functionReturnJsonObject,
      threadOpenaiId: run.thread_id,
      assistantOpenaiId: run.assistant_id,
      threadEnd: true,
    };
  }
}
