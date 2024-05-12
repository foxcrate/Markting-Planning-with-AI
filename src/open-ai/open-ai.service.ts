import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads';
import { SenderRole } from 'src/enums/sender-role.enum';
import { MessageRepository } from 'src/message/message.repository';
import { ParameterObjectDto } from 'src/template/dtos/parameter-object.dto';

@Injectable()
export class OpenAiService implements OnModuleInit {
  constructor(
    private config: ConfigService,
    private messageRepository: MessageRepository,
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
    let functionsParametersObject: any =
      this.createFunctionParametersObject(functionParameters);

    let parametersArray = this.createParametersArray(functionParameters);

    const assistant = await this.instance.beta.assistants.create({
      name: name,
      instructions:
        'Start the conversation by greeting the user.\n' +
        description +
        '\n Collect the data step by step. When you collect this data, call the end_flow function',
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
    });
    return assistant;
  }

  async updateTemplateAssistance(
    assistantId: string,
    name: string,
    description: string,
    functionParameters: ParameterObjectDto[],
  ) {
    let functionsParametersObject =
      this.createFunctionParametersObject(functionParameters);

    let parametersArray = this.createParametersArray(functionParameters);

    const assistant = await this.instance.beta.assistants.update(assistantId, {
      name: name,
      instructions:
        'Start the conversation by greeting the user and saying who are you.\n' +
        description +
        '\n Collect the data step by step. When you collect this data, call the end_flow function',
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
    });
    return assistant;
  }

  async runTemplateAssistant(
    openaiAssistantId: string,
    threadOpenaiId: string,
  ): Promise<{
    assistantMessage: string;
    threadOpenaiId: string;
    assistantOpenaiId: string;
    threadEnd: boolean;
  }> {
    let run = await this.instance.beta.threads.runs.create(threadOpenaiId, {
      assistant_id: openaiAssistantId,
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
    } else if (
      run.status === 'requires_action' &&
      run.required_action.submit_tool_outputs.tool_calls[0].function.name ===
        'end_flow'
    ) {
      // console.log('-------- run info -----------');

      // console.log(
      //   JSON.parse(
      //     run.required_action.submit_tool_outputs.tool_calls[0].function
      //       .arguments,
      //   ),
      // );

      // console.log('-------------------');

      let functionReturnJsonObject = JSON.parse(
        run.required_action.submit_tool_outputs.tool_calls[0].function
          .arguments,
      );

      await this.instance.beta.threads.runs.cancel(run.thread_id, run.id);

      return {
        assistantMessage: functionReturnJsonObject,
        threadOpenaiId: run.thread_id,
        assistantOpenaiId: run.assistant_id,
        threadEnd: true,
      };
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

  createFunctionParametersObject(functionParameters: ParameterObjectDto[]) {
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

  createParametersArray(functionParameters: ParameterObjectDto[]) {
    return functionParameters.map((functionParameter) => {
      return functionParameter.name;
    });
  }
}
