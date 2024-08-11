import { Injectable, NotFoundException } from '@nestjs/common';
import { TemplateCategoryRepository } from './template-category.repository';
import { TemplateCategoryCreateDto } from './dtos/template-category-create.dto';
import { TemplateCategoryReturnDto } from './dtos/template-category-return.dto';

@Injectable()
export class TemplateCategoryService {
  constructor(
    private readonly templateCategoryRepository: TemplateCategoryRepository,
  ) {}
  async create(
    reqBody: TemplateCategoryCreateDto,
    userId: number,
  ): Promise<TemplateCategoryReturnDto> {
    let newTemplateCategory =
      await this.templateCategoryRepository.create(reqBody);

    return await this.templateCategoryRepository.findById(
      newTemplateCategory.id,
    );
  }

  async update(
    updateBody: TemplateCategoryCreateDto,
    templateCategoryId: number,
    userId: number,
  ) {
    await this.templateCategoryRepository.update(
      updateBody,
      templateCategoryId,
    );
    return await this.getOne(templateCategoryId);
  }

  //get one templateCategory
  async getOne(templateCategoryId: number): Promise<TemplateCategoryReturnDto> {
    let templateCategory =
      await this.templateCategoryRepository.findById(templateCategoryId);
    if (!templateCategory) {
      throw new NotFoundException('Template Category not found');
    }
    return templateCategory;
  }

  //get all templateCategories
  async getAll() {
    return await this.templateCategoryRepository.getAll();
  }

  async delete(templateCategoryId: number, userId: number) {
    let deletedTemplateCategory = await this.getOne(templateCategoryId);
    await this.templateCategoryRepository.deleteById(templateCategoryId);
    return deletedTemplateCategory;
  }
}
