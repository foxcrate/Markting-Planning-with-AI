import { forwardRef, Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { TemplateModule } from 'src/template/template.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { ThreadModule } from 'src/thread/thread.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [DocumentService],
  imports: [
    forwardRef(() => TemplateModule),
    forwardRef(() => OpenAiModule),
    ThreadModule,
    WorkspaceModule,
    UserModule,
  ],
})
export class DocumentModule {}
