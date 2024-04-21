import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TemplateDto } from './dtos/template.dto';

@Injectable()
export class UserTemplateFlowRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async create(template: TemplateDto) {
    const query = `
    INSERT INTO templates
    (name,type,flow)
    values (?,?,?)
   `;

    let { insertId } = await this.entityManager.query(query, [
      template.name,
      template.type,
      JSON.stringify(template.flow),
    ]);

    return await this.findById(insertId);
  }

  async findById(id: number) {}
}
