import { forwardRef, Module } from '@nestjs/common';
import { OpenAiController } from './open-ai.controller';
import { OpenAiService } from './open-ai.service';
import { MessageModule } from 'src/message/message.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { FunnelModule } from 'src/funnel/funnel.module';
import { ThreadModule } from 'src/thread/thread.module';
import { TacticModule } from 'src/tactic/tactic.module';
import { StageModule } from 'src/stage/stage.module';
import { TemplateModule } from 'src/template/template.module';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  exports: [OpenAiService],
  imports: [
    MessageModule,
    WorkspaceModule,
    FunnelModule,
    forwardRef(() => ThreadModule),
    forwardRef(() => TemplateModule),
    StageModule,
    TacticModule,
  ],
})
export class OpenAiModule {}
