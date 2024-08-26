import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { DocumentReturnDto } from './dtos/document-return.dto';
import { DocumentDto } from './dtos/document.dto';
import { GetAllFilterDto } from './dtos/get-all-filter.dto';

@Injectable()
export class DocumentRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  async getAllByUserId(
    filterOptions: GetAllFilterDto,
    userId: number,
  ): Promise<DocumentReturnDto[]> {
    const queryStart = `
      SELECT
        documents.id,
        documents.name,
        documents.requiredData,
        documents.confirmedAnswer,
        JSON_EXTRACT(aiResponse,'$[*]') AS aiResponse,
        documents.templateId,
        documents.userId
      FROM
        documents
      WHERE
        userId = ?
    `;

    let filter = ``;
    if (filterOptions.name) {
      filter = filter + ` AND documents.name LIKE '%${filterOptions.name}%' `;
    }
    if (filterOptions.templateId) {
      filter =
        filter + ` AND documents.templateId =${filterOptions.templateId} `;
    }

    const queryEnd = ``;

    let documents = await this.db.query(queryStart + filter + queryEnd, [
      userId,
    ]);

    // loop over documents

    for (const document of documents) {
      try {
        if (document.requiredData) {
          document.requiredData = eval(`(${document.requiredData})`);
        }
        // document.aiResponse = eval(`(${document.aiResponse})`);
      } catch (error) {
        console.error('Parsing error:', error);
      }
    }

    return documents;
  }

  async create(reqBody: DocumentDto) {
    // console.log(reqBody);

    const query = `
    INSERT
    INTO
    documents (
    name,
    requiredData,
    confirmedAnswer,
    aiResponse,
    templateId,
    userId
    ) VALUES (?,?,?,?,?,?)
  `;

    let { insertId } = await this.db.query(query, [
      reqBody.name,
      reqBody.requiredData ? JSON.stringify(reqBody.requiredData) : null,
      reqBody.confirmedAnswer,
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
      documents.confirmedAnswer,
      JSON_EXTRACT(aiResponse,'$[*]') AS aiResponse,
      templateId,
      userId
    FROM
        documents
    WHERE
        id = ?
    `;
    let [theDocument] = await this.db.query(query, [id]);

    // console.log('theDocument.aiResponse:', theDocument.aiResponse);

    try {
      theDocument.requiredData = eval(`(${theDocument.requiredData})`);
      // theDocument.aiResponse = eval(`(${theDocument.aiResponse})`);
    } catch (error) {
      console.error('Parsing error:', error);
    }
    // console.log('theDocument.aiResponse:', theDocument.aiResponse);
    return theDocument;
  }

  async update(reqBody: DocumentDto, id: number) {
    const query = `
      UPDATE
      documents
      SET
      name = IFNULL(?,documents.name),
      requiredData = IFNULL(?,documents.requiredData),
      confirmedAnswer = IFNULL(?,documents.confirmedAnswer),
      aiResponse = IFNULL(?,documents.aiResponse),
      templateId = IFNULL(?,documents.templateId),
      userId = IFNULL(?,documents.userId)
      WHERE id = ?
    `;

    await this.db.query(query, [
      reqBody.name,
      reqBody.requiredData ? JSON.stringify(reqBody.requiredData) : null,
      reqBody.confirmedAnswer,
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
