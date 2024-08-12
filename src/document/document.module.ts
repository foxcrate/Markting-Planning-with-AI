import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { TemplateModule } from 'src/template/template.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [DocumentService],
  imports: [TemplateModule],
})
export class DocumentModule {}
