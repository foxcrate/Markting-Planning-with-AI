import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentCreateDto } from './dtos/document-create.dto';
import { DocumentReturnDto } from './dtos/document-return.dto';
import { DocumentRepository } from './document.repository';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async create(
    reqBody: DocumentCreateDto,
    userId: number,
  ): Promise<DocumentReturnDto> {
    let newDocument = await this.documentRepository.create(reqBody);

    return await this.documentRepository.findById(newDocument.id);
  }

  async update(
    updateBody: DocumentCreateDto,
    documentId: number,
    userId: number,
  ) {
    await this.documentRepository.update(updateBody, documentId);
    return await this.getOne(documentId);
  }

  //get one templateCategory
  async getOne(documentId: number): Promise<DocumentReturnDto> {
    let document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  //get all templateCategories
  async getAll(userId: number) {
    return await this.documentRepository.getAllByUserId(userId);
  }

  async delete(documentId: number, userId: number) {
    let deletedDocument = await this.getOne(documentId);
    await this.documentRepository.deleteById(documentId);
    return deletedDocument;
  }
}
