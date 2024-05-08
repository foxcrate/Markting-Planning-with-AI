import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OnboardingTemplateDto } from './dtos/onboarding-template.dto';
import { TemplateReturnDto } from './dtos/template-return.dto';
import { TemplateType } from 'src/enums/template-type.enum';
import { TemplateDto } from './dtos/template.dto';

@Injectable()
export class TemplateRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(template: TemplateDto): Promise<TemplateReturnDto> {
    const query = `
    INSERT INTO templates
    (name,type,description,parameters,openaiAssistantId)
    values (?,?,?,?,?)
   `;

    let { insertId } = await this.entityManager.query(query, [
      template.name,
      template.type,
      template.description,
      JSON.stringify(template.parameters),
      template.openaiAssistantId,
    ]);

    return await this.findById(insertId);
  }

  async update(id: number, template: TemplateDto): Promise<TemplateReturnDto> {
    const query = `
    UPDATE templates
    SET
    name = COALESCE(?,name),
    type = COALESCE(?,type),
    description = COALESCE(?,description),
    parameters = COALESCE(?,parameters)
    WHERE id= ?
   `;

    await this.entityManager.query(query, [
      template.name,
      template.type,
      template.description,
      JSON.stringify(template.parameters),
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
      templates.parameters,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.id = ?
   `;
    const templates = await this.entityManager.query(query, [templateId]);

    if (templates.length === 0) {
      return null;
    }

    const template = templates[0];

    template.parameters = JSON.parse(template.parameters);

    return template;
  }

  async findByName(name: string): Promise<TemplateReturnDto> {
    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.parameters,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.name = ?
   `;
    const templates = await this.entityManager.query(query, [name]);

    if (templates.length === 0) {
      return null;
    }
    const template = templates[0];

    template.parameters = JSON.parse(template.parameters);

    return template;
  }

  async findByType(type: string): Promise<TemplateReturnDto> {
    const query = `
    SELECT
      templates.id,
      templates.name,
      templates.type,
      templates.description,
      templates.parameters,
      templates.openaiAssistantId
    FROM templates
    WHERE templates.type = ?
   `;
    const templates = await this.entityManager.query(query, [type]);

    if (templates.length === 0) {
      return null;
    }
    const template = templates[0];

    template.parameters = JSON.parse(template.parameters);

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
    const [template] = await this.entityManager.query(query, [
      TemplateType.ONBOARDING,
    ]);

    template.parameters = JSON.parse(template.parameters);
    return template;
  }
}
