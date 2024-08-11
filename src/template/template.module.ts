import { forwardRef, Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateRepository } from './template.repository';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { keyValueFlowValidator } from './validators/key-value-flow.validator';
import { MessageModule } from 'src/message/message.module';
import { ThreadModule } from 'src/thread/thread.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { FunnelModule } from 'src/funnel/funnel.module';
import { StageModule } from 'src/stage/stage.module';
import { TemplateCategoryModule } from 'src/template-category/template-category.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRepository, keyValueFlowValidator],
  imports: [
    forwardRef(() => OpenAiModule),
    MessageModule,
    ThreadModule,
    WorkspaceModule,
    FunnelModule,
    StageModule,
    TemplateCategoryModule,
  ],
  exports: [TemplateService, TemplateRepository],
})
export class TemplateModule {}
