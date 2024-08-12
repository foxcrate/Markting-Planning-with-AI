import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentCreateDto } from './dtos/document-create.dto';
import { DocumentReturnDto } from './dtos/document-return.dto';
import { DocumentRepository } from './document.repository';
import { DocumentDto } from './dtos/document.dto';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async create(
    reqBody: DocumentCreateDto,
    userId: number,
  ): Promise<DocumentReturnDto> {
    let createDocumentBody: DocumentDto = {
      ...reqBody,
      userId: userId,
      aiResponse: null,
    };
    let newDocument = await this.documentRepository.create(createDocumentBody);

    return await this.documentRepository.findById(newDocument.id);
  }

  async update(
    updateBody: DocumentCreateDto,
    documentId: number,
    userId: number,
  ) {
    //validate ownership
    await this.isOwner(documentId, userId);

    let updateDocumentBody: DocumentDto = {
      ...updateBody,
      userId: userId,
      aiResponse: null,
    };
    await this.documentRepository.update(updateDocumentBody, documentId);
    return await this.documentRepository.findById(documentId);
  }

  //get one templateCategory
  async getOne(documentId: number, userId: number): Promise<DocumentReturnDto> {
    //validate ownership
    await this.isOwner(documentId, userId);

    let document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  //get all templateCategories
  async getAllByUserId(userId: number) {
    return await this.documentRepository.getAllByUserId(userId);
  }

  async delete(documentId: number, userId: number) {
    //validate ownership
    await this.isOwner(documentId, userId);

    let deletedDocument = await this.documentRepository.findById(documentId);
    await this.documentRepository.deleteById(documentId);
    return deletedDocument;
  }

  async isOwner(documentId: number, userId: number) {
    // return true;
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this document');
    }
  }
}
