import { Inject, Injectable } from '@nestjs/common';
import { TemplateReturnDto } from './dtos/template-return.dto';
import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { TemplateDto } from './dtos/template.dto';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';

@Injectable()
export class TemplateRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async create(template: TemplateDto): Promise<TemplateReturnDto> {
    const query = `
    INSERT INTO templates
    (name,type,description,example,maxCharacters,generatedDocumentsNum,profilePicture,categoryId,parameters,requiredData,openaiAssistantId)
    values (?,?,?,?,?,?,?,?,?,?,?)
   `;

    let { insertId } = await this.db.query(query, [
      template.name,
      template.type,
      template.description,
      template.example,
      template.maxCharacters,
      template.generatedDocumentsNum,
      template.profilePicture,
      template.categoryId,
      template.parameters ? JSON.stringify(template.parameters) : null,
      template.requiredData ? JSON.stringify(template.requiredData) : null,
      template.openaiAssistantId,
    ]);

    return await this.findById(Number(insertId));
  }

  async update(id: number, template: TemplateDto): Promise<TemplateReturnDto> {
    const query = `
    UPDATE templates
    SET
    name = COALESCE(?,name),
    type = COALESCE(?,type),
    description = COALESCE(?,description),
    example = COALESCE(?,example),
    maxCharacters = COALESCE(?,maxCharacters),
    generatedDocumentsNum = COALESCE(?,generatedDocumentsNum),
    profilePicture = COALESCE(?,profilePicture),
    categoryId = COALESCE(?,categoryId),
    requiredData = COALESCE(?,requiredData),
    parameters = COALESCE(?,parameters)
    WHERE id= ?
   `;

    await this.db.query(query, [
      template.name,
      template.type,
      template.description,
      template.example,
      template.maxCharacters,
      template.generatedDocumentsNum,
      template.profilePicture,
      template.categoryId,
      template.requiredData ? JSON.stringify(template.requiredData) : null,
      template.parameters ? JSON.stringify(template.parameters) : null,
      id,
    ]);

    return await this.findById(id);
  }

  async findById(templateId: number): Promise<TemplateReturnDto> {
    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.example,
      templates.maxCharacters,
      templates.generatedDocumentsNum,
      templates.profilePicture,
      templates.categoryId,
      templates.parameters,
      templates.requiredData,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.id = ?
   `;
    const templates = await this.db.query(query, [templateId]);

    if (templates.length === 0) {
      return null;
    }

    const template = templates[0];

    // template.parameters = JSON.parse(JSON.stringify(template.parameters));
    try {
      template.parameters = eval(`(${template.parameters})`);
      template.requiredData = eval(`(${template.requiredData})`);
      // console.log(arrayOfObjects);
    } catch (error) {
      console.error('Parsing error:', error);
    }

    return template;
  }

  async delete(templateId: number) {
    const query = `
  DELETE
  FROM
   templates
  WHERE
    templates.id = ?
   `;
    const templates = await this.db.query(query, [templateId]);
  }

  async getAll(filterOptions: GetAllFilterDto): Promise<TemplateReturnDto[]> {
    const queryStart = `
      SELECT
        templates.id,
        templates.name,
        templates.type,
        templates.description,
        templates.example,
        templates.maxCharacters,
        templates.generatedDocumentsNum,
        templates.profilePicture,
        templates.categoryId,
        templates.parameters,
        templates.requiredData,
        templates.openaiAssistantId
      FROM templates
      WHERE
        templates.type = 'custom'
      `;

    let filter = ``;
    if (filterOptions.name) {
      filter = filter + ` AND templates.name LIKE '%${filterOptions.name}%' `;
    }
    if (filterOptions.categoryId) {
      filter =
        filter + ` AND templates.categoryId =${filterOptions.categoryId} `;
    }

    const queryEnd = ``;

    const templates = await this.db.query(queryStart + filter + queryEnd);

    // loop over templates
    for (const template of templates) {
      // template.parameters = JSON.parse(JSON.stringify(template.parameters));
      try {
        template.parameters = eval(`(${template.parameters})`);
        template.requiredData = eval(`(${template.requiredData})`);
        // console.log(arrayOfObjects);
      } catch (error) {
        console.error('Parsing error:', error);
      }
    }

    return templates;
  }

  async findByName(name: string): Promise<TemplateReturnDto> {
    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.example,
      templates.maxCharacters,
      templates.generatedDocumentsNum,
      templates.profilePicture,
      templates.categoryId,
      templates.parameters,
      templates.requiredData,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.name = ?
   `;
    const templates = await this.db.query(query, [name]);

    if (templates.length === 0) {
      return null;
    }
    const template = templates[0];

    // template.parameters = JSON.parse(JSON.stringify(template.parameters));

    try {
      template.parameters = eval(`(${template.parameters})`);
      template.requiredData = eval(`(${template.requiredData})`);
      // console.log(arrayOfObjects);
    } catch (error) {
      console.error('Parsing error:', error);
    }

    return template;
  }

  async findByType(type: string): Promise<TemplateReturnDto> {
    // console.log('aloooooooo');

    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.example,
      templates.maxCharacters,
      templates.generatedDocumentsNum,
      templates.profilePicture,
      templates.categoryId,
      templates.parameters,
      templates.requiredData,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.type = ?
   `;
    const templates = await this.db.query(query, [type]);

    if (templates.length === 0) {
      return null;
    }
    const template = templates[0];

    // template.parameters = JSON.parse(template.parameters);

    try {
      template.parameters = eval(`(${template.parameters})`);
      template.requiredData = eval(`(${template.requiredData})`);
      // console.log(arrayOfObjects);
    } catch (error) {
      console.error('Parsing error:', error);
    }

    // console.log(template);

    return template;
  }

  // get template step

  async getOnboardingTemplate(): Promise<TemplateReturnDto> {
    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.parameters,
      templates.openaiAssistantId
    FROM templates
    WHERE type = ?
   `;
    const [template] = await this.db.query(query, [
      TemplateTypeEnum.ONBOARDING,
    ]);

    // template.parameters = JSON.parse(JSON.stringify(template.parameters));

    try {
      template.parameters = eval(`(${template.parameters})`);
      // console.log(arrayOfObjects);
    } catch (error) {
      console.error('Parsing error:', error);
    }
    return template;
  }
}
