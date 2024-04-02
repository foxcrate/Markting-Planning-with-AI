import {
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { config } from 'process';

@Injectable()
export class OpenAiService implements OnModuleInit {
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
}
