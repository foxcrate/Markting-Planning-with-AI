import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { DocumentCreateDto } from './dtos/document-create.dto';
import { DocumentReturnDto } from './dtos/document-return.dto';

@Injectable()
export class DocumentRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  async getAllByUserId(userId: number): Promise<DocumentReturnDto[]> {
    const query = `
      SELECT
      template_category.id,
      template_category.name
      FROM template_category
    `;
    let templateCategories = await this.db.query(query);

    return templateCategories;
  }

  async create(reqBody: DocumentCreateDto) {
    const query = `
    INSERT INTO template_category (name) VALUES (?)
  `;

    let { insertId } = await this.db.query(query, [reqBody.name]);

    return await this.findById(Number(insertId));
  }

  async findById(id: number): Promise<DocumentReturnDto> {
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

  async update(reqBody: DocumentCreateDto, id: number) {
    const query = `
      UPDATE
      template_category
      SET
      name = IFNULL(?,template_category.name)
      WHERE id = ?
    `;
    await this.db.query(query, [reqBody.name, id]);
  }

  async deleteById(documentId: number): Promise<any> {
    const query = `
      DELETE
      FROM
      template_category
      WHERE id = ?
    `;
    await this.db.query(query, [documentId]);
  }
}
