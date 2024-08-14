import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { DocumentReturnDto } from './dtos/document-return.dto';
import { DocumentDto } from './dtos/document.dto';

@Injectable()
export class DocumentRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  async getAllByUserId(userId: number): Promise<DocumentReturnDto[]> {
    const query = `
      SELECT
      documents.id,
      documents.name,
      documents.requiredData,
      documents.aiResponse,
      documents.templateId,
      documents.userId
      FROM
      documents
      WHERE
      userId = ?
    `;
    let documents = await this.db.query(query, [userId]);

    // loop over documents
    for (const document of documents) {
      try {
        document.requiredData = eval(`(${document.requiredData})`);
        document.aiResponse = eval(`(${document.aiResponse})`);
      } catch (error) {
        console.error('Parsing error:', error);
      }
    }

    return documents;
  }

  async create(reqBody: DocumentDto) {
    console.log(reqBody);

    const query = `
    INSERT
    INTO
    documents (
    name,
    requiredData,
    aiResponse,
    templateId,
    userId
    ) VALUES (?,?,?,?,?)
  `;

    let { insertId } = await this.db.query(query, [
      reqBody.name,
      reqBody.requiredData ? JSON.stringify(reqBody.requiredData) : null,
      // reqBody.requiredData,
      reqBody.aiResponse,
      reqBody.templateId,
      reqBody.userId,
    ]);

    return await this.findById(Number(insertId));
  }

  async findById(id: number): Promise<DocumentReturnDto> {
    const query = `
    SELECT
      id,
      name,
      requiredData,
      aiResponse,
      templateId,
      userId
    FROM
        documents
    WHERE
        id = ?
    `;
    let [theDocument] = await this.db.query(query, [id]);

    console.log('theDocument.aiResponse:', theDocument.aiResponse);

    try {
      theDocument.requiredData = eval(`(${theDocument.requiredData})`);
      theDocument.aiResponse = eval(`(${theDocument.aiResponse})`);
    } catch (error) {
      console.error('Parsing error:', error);
    }
    console.log('theDocument.aiResponse:', theDocument.aiResponse);
    return theDocument;
  }

  async update(reqBody: DocumentDto, id: number) {
    const query = `
      UPDATE
      documents
      SET
      name = IFNULL(?,documents.name),
      requiredData = IFNULL(?,documents.requiredData),
      aiResponse = IFNULL(?,documents.aiResponse),
      templateId = IFNULL(?,documents.templateId),
      userId = IFNULL(?,documents.userId)
      WHERE id = ?
    `;

    await this.db.query(query, [
      reqBody.name,
      reqBody.requiredData ? JSON.stringify(reqBody.requiredData) : null,
      reqBody.aiResponse,
      reqBody.templateId,
      reqBody.userId,
      id,
    ]);
  }

  async deleteById(documentId: number) {
    const query = `
      DELETE
      FROM
      documents
      WHERE id = ?
    `;
    await this.db.query(query, [documentId]);
  }
}
