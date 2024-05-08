import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateRepository } from './template.repository';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { keyValueFlowValidator } from './validators/key-value-flow.validator';
import { MessageModule } from 'src/message/message.module';
import { ThreadModule } from 'src/thread/thread.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRepository, keyValueFlowValidator],
  imports: [OpenAiModule, MessageModule, ThreadModule],
})
export class TemplateModule {}
