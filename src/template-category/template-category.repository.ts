import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { TemplateCategoryCreateDto } from './dtos/template-category-create.dto';
import { TemplateCategoryReturnDto } from './dtos/template-category-return.dto';

@Injectable()
export class TemplateCategoryRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  async getAll(): Promise<any> {
    const query = `
      SELECT
      template_category.id,
      template_category.name
      FROM template_category
    `;
    let templateCategories = await this.db.query(query);

    return templateCategories;
  }

  async create(reqBody: TemplateCategoryCreateDto) {
    const query = `
    INSERT INTO template_category (name) VALUES (?)
  `;

    let { insertId } = await this.db.query(query, [reqBody.name]);

    return await this.findById(Number(insertId));
  }

  async findById(id: number): Promise<TemplateCategoryReturnDto> {
    const query = `
    SELECT
        id,
        name
    FROM
        template_category
    WHERE
        id = ?
    `;
    let [theTemplateCategory] = await this.db.query(query, [id]);
    return theTemplateCategory;
  }

  async update(reqBody: TemplateCategoryCreateDto, id: number) {
    const query = `
      UPDATE
      template_category
      SET
      name = IFNULL(?,template_category.name)
      WHERE id = ?
    `;
    await this.db.query(query, [reqBody.name, id]);
  }

  async deleteById(templateCategoryId: number): Promise<any> {
    const query = `
      DELETE
      FROM
      template_category
      WHERE id = ?
    `;
    await this.db.query(query, [templateCategoryId]);
  }
}
