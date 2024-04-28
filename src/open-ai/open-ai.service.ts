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

  // async sendFirstAiMessage(message: string, threadId) {
  //   // return this.config.get('OPENAI_TEST_THREAD');
  //   console.log({ message });

  //   await this.instance.beta.threads.messages.create(
  //     this.config.get('OPENAI_TEST_THREAD'),
  //     {
  //       role: 'user',
  //       content: 'ai: ' + message,
  //     },
  //   );

  //   await this.messageRepository.create(message, threadId, SenderRole.ASSISTANT);
  //   // return true;
  // }

  async sendAiMessage(message: string, threadId) {
    // return this.config.get('OPENAI_TEST_THREAD');
    console.log({ message });

    // await this.instance.beta.threads.messages.create(
    //   this.config.get('OPENAI_TEST_THREAD'),
    //   {
    //     role: 'user',
    //     content: 'ai: ' + message,
    //   },
    // );

    await this.messageRepository.create(
      message,
      threadId,
      SenderRole.ASSISTANT,
    );
    // return true;
  }

  async inThreadSummarization(threadId) {
    // return this.config.get('OPENAI_TEST_THREAD');
    let run = await this.instance.beta.threads.runs.create(
      this.config.get('OPENAI_TEST_THREAD'),
      {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
        additional_instructions:
          'Summarize the messages in this thread and' +
          'return the summarization to the user in a paragraph. ' +
          'Start the summary paragraph without any introduction.',
      },
    );

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
      //   for (const message of messages.data.reverse()) {
      //     console.log(message.content[0].text.value);
      //   }
      //   console.log(messages.data);
      console.log(JSON.stringify(messages));

      // await this.sendAiMessage(
      //   messages.data[0].content[0].text.value,
      //   threadId,
      // );

      return {
        message: messages.data[0].content[0].text.value,
        threadId: this.config.get('OPENAI_TEST_THREAD'),
      };
    } else {
      console.log(run);
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
    }
  }

  async bebo() {
    console.log('bebo, bebo, bebo, bebo');
  }

  async run(threadId) {
    // return this.config.get('OPENAI_TEST_THREAD');
    let run = await this.instance.beta.threads.runs.create(
      this.config.get('OPENAI_TEST_THREAD'),
      {
        assistant_id: process.env.ONBOARDING_ASSISTANT_ID,
        // additional_instructions:
        // 'you start the conversation with the user, ' +
        // // "don't add 'Assistant:' before the response." +
        // // 'your task is: ' +
        // "get the user's project name. " +
        // // '. end the conversation after you finish your task',
        // // 'ask the user about his project budget. ' +
        // 'Call the end_thread function when user type done',
        // tools: [
        //   {
        //     type: 'function',
        //     function: {
        //       name: 'hamada',
        //       description: 'call the function when user type hamada_hamada',
        //       parameters: {
        //         type: 'object',
        //         properties: {},
        //         required: [],
        //       },
        //     },
        //   },
        // ],
      },
    );

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
      //   for (const message of messages.data.reverse()) {
      //     console.log(message.content[0].text.value);
      //   }
      //   console.log(messages.data);
      console.log(JSON.stringify(messages));

      await this.sendAiMessage(
        messages.data[0].content[0].text.value,
        threadId,
      );

      return {
        message: messages.data[0].content[0].text.value,
        threadId: this.config.get('OPENAI_TEST_THREAD'),
      };
    } else {
      console.log(JSON.stringify(run));
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
    }
  }

  async saveMessageToThread(message: string, threadId) {
    // return this.config.get('OPENAI_TEST_THREAD');

    await this.instance.beta.threads.messages.create(
      this.config.get('OPENAI_TEST_THREAD'),
      {
        role: 'user',
        content: message,
      },
    );

    await this.messageRepository.create(message, threadId, SenderRole.USER);

    console.log('alo3');

    let run = await this.instance.beta.threads.runs.create(
      this.config.get('OPENAI_TEST_THREAD'),
      {
        assistant_id: process.env.ONBOARDING_ASSISTANT_ID,
        // additional_instructions:
        // "get the user's project name. " +
        // // '. end the conversation after you finish your task',
        // // 'ask the user about his project budget. ' +
        // 'Call the end_thread function when user type done',
      },
    );

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
      //   for (const message of messages.data.reverse()) {
      //     console.log(message.content[0].text.value);
      //   }
      //   console.log(messages.data);

      console.log(JSON.stringify(messages));

      // await this.messageRepository.create(
      //   messages.data[0].content[0].text.value,
      //   threadId,
      //   SenderRole.ASSISTANT,
      // );

      await this.sendAiMessage(
        messages.data[0].content[0].text.value,
        threadId,
      );

      return {
        message: messages.data[0].content[0].text.value,
        threadId: this.config.get('OPENAI_TEST_THREAD'),
      };
    } else {
      console.log(JSON.stringify(run));
      throw new UnprocessableEntityException(
        `error in openAI run: ${run.status}`,
      );
    }
  }

  async summarize(threadId) {
    // let run = await this.instance.beta.threads.runs.create(
    //   this.config.get('OPENAI_TEST_THREAD'),
    //   {
    //     assistant_id: process.env.JSON_ASSISTANT_ID,
    //     // instructions:
    //     //   "you start the conversation with the user, don't add 'Assistant:' before the response." +
    //     //   'ask the user about his project name',
    //     instructions:
    //       // "you start the conversation , don't add 'Assistant:' before the response, response should be json only" +
    //       'you start the conversation, the message should only contain a json object that summarize the information you get from the user used this current thread, the json object contains these keys: [' +
    //       'project_name' +
    //       ']',
    //   },
    // );

    let messages = await this.messageRepository.getAllThreadMessages(threadId);

    let formatedMessages2: Array<ThreadCreateParams.Message> = [];

    for (const message of messages) {
      formatedMessages2.push({
        role: 'user',
        content:
          message.senderRole === 'user'
            ? 'user: ' + message.content
            : 'assistant: ' + message.content,
      });
    }

    // console.log({ formatedMessages });

    console.log({ formatedMessages2 });

    // return 'alo';

    const thread = await this.instance.beta.threads.create({
      messages: formatedMessages2,
    });

    let run = await this.instance.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.SUMMARIZATION_ASSITANT_ID,
      // instructions:
      //   'json contains: +' + 'project_name' + ',' + 'project budget',
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
      //   for (const message of messages.data.reverse()) {
      //     console.log(message.content[0].text.value);
      //   }

      console.log(messages.data[0].content[0].text.value);
      // console.log(JSON.stringify(messages));

      return {
        message: messages.data[0].content[0].text.value,
        threadId: this.config.get('OPENAI_TEST_THREAD'),
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
      //   for (const message of messages.data.reverse()) {
      //     console.log(message.content[0].text.value);
      //   }
      //   console.log(messages.data);

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

  async promptToAiQuestion(prompt: string): Promise<string> {
    try {
      const completion = await this.instance.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt,
      });
      if (!completion.choices[0]) {
        throw new UnprocessableEntityException('no response from openAI');
      }
      let aiQuestion = completion.choices[0].text;
      return aiQuestion;
    } catch (error: any) {
      console.log(error);
      throw new UnprocessableEntityException(error.error.message);
    }
  }
}
