import { Module } from '@nestjs/common';
import { TemplateCategoryController } from './template-category.controller';
import { TemplateCategoryService } from './template-category.service';
import { TemplateCategoryRepository } from './template-category.repository';

@Module({
  controllers: [TemplateCategoryController],
  providers: [TemplateCategoryService, TemplateCategoryRepository],
  exports: [TemplateCategoryService],
})
export class TemplateCategoryModule {}
