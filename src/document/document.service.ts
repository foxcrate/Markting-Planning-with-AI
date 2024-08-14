import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DocumentCreateDto } from './dtos/document-create.dto';
import { DocumentReturnDto } from './dtos/document-return.dto';
import { DocumentRepository } from './document.repository';
import { DocumentDto } from './dtos/document.dto';
import { DocumentUpdateDto } from './dtos/document-update.dto';
import { TemplateService } from 'src/template/template.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { ThreadRepository } from 'src/thread/thread.repository';
import { WorkspaceRepository } from 'src/workspace/workspace.repository';
import { FastifyReply } from 'fastify';
const PDFDocument = require('pdfkit');
import * as docx from 'docx';

@Injectable()
export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    @Inject(forwardRef(() => OpenAiService))
    private readonly openAiService: OpenAiService,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}
  async create(
    reqBody: DocumentCreateDto,
    userId: number,
  ): Promise<DocumentReturnDto> {
    //validate templates existance
    let theTemplate = await this.templateService.getOne(reqBody.templateId);

    //validate template required data

    await this.validateTemplateRequiredData(
      theTemplate.id,
      reqBody.requiredData,
    );

    let createDocumentBody: DocumentDto = {
      ...reqBody,
      userId: userId,
      aiResponse: null,
    };
    let newDocument = await this.documentRepository.create(createDocumentBody);

    //create thread
    let openAiThread = await this.openAiService.createUserThread();
    // let theThread = await this.threadRepository.create(
    //   userId,
    //   reqBody.templateId,
    //   openAiThread.id,
    // );

    //formulate the run instructions
    let userWorkspaces =
      await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
    if (userWorkspaces.length === 0) {
      throw new BadRequestException('user has no workspace');
    }

    let runInstruction = await this.templateService.getTemplateRunInstruction(
      reqBody.templateId,
      newDocument.id,
      userId,
      userWorkspaces[0].id,
      null,
      null,
    );

    console.log('runInstruction:', runInstruction);

    //call ai
    let aiResponse = await this.openAiService.runDocumentTemplateAssistant(
      theTemplate.openaiAssistantId,
      openAiThread.id,
      runInstruction,
    );

    //update document aiResponse and return whole document

    return await this.confirmAiResponse(
      newDocument.id,
      aiResponse.assistantMessage,
      userId,
    );
  }

  async update(
    updateBody: DocumentUpdateDto,
    documentId: number,
    userId: number,
  ) {
    //validate ownership
    await this.isOwner(documentId, userId);

    //vallidate templates existance
    let theTemplate = await this.templateService.getOne(updateBody.templateId);

    await this.validateTemplateRequiredData(
      theTemplate.id,
      updateBody.requiredData,
    );

    //call ai

    let updateDocumentBody: DocumentDto = {
      ...updateBody,
      userId: null,
      aiResponse: null,
    };
    await this.documentRepository.update(updateDocumentBody, documentId);
    return await this.documentRepository.findById(documentId);
  }

  async regenerateAiResponse(documentId: number, userId: number) {
    //validate ownership
    await this.isOwner(documentId, userId);

    //call ai

    let theDocument = await this.documentRepository.findById(documentId);
    let theTemplate = await this.templateService.getOne(theDocument.templateId);

    //create thread
    let openAiThread = await this.openAiService.createUserThread();

    // let theThread = await this.threadRepository.create(
    //   userId,
    //   theDocument.templateId,
    //   openAiThread.id,
    // );

    //formulate the run instructions
    let userWorkspaces =
      await this.workspaceRepository.findUserConfirmedWorkspaces(userId);
    if (userWorkspaces.length === 0) {
      throw new BadRequestException('user has no workspace');
    }

    let runInstruction = await this.templateService.getTemplateRunInstruction(
      theDocument.templateId,
      theDocument.id,
      userId,
      userWorkspaces[0].id,
      null,
      null,
    );

    console.log('runInstruction:', runInstruction);

    //call ai
    let aiResponse = await this.openAiService.runDocumentTemplateAssistant(
      theTemplate.openaiAssistantId,
      openAiThread.id,
      runInstruction,
    );

    //update document aiResponse and return whole document

    return await this.confirmAiResponse(
      theDocument.id,
      aiResponse.assistantMessage,
      userId,
    );
  }

  async confirmAiResponse(
    documentId: number,
    aiResponse: string,
    userId: number,
  ) {
    //validate ownership
    await this.isOwner(documentId, userId);

    //update document

    let updateDocumentBody: DocumentDto = {
      requiredData: null,
      aiResponse: aiResponse,
      userId: null,
      name: null,
      templateId: null,
    };
    await this.documentRepository.update(updateDocumentBody, documentId);

    return await this.documentRepository.findById(documentId);
  }

  //get one document
  async getOne(documentId: number, userId: number): Promise<DocumentReturnDto> {
    //validate ownership
    if (userId !== 0) {
      await this.isOwner(documentId, userId);
    }

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

  async pdfExport(res: FastifyReply, documentId: number, userId: number) {
    let theDocument = await this.getOne(documentId, userId);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      doc.text(theDocument.aiResponse, 100, 50);
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    res.headers({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=documentExport.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  async docExport(res: FastifyReply, documentId: number, userId: number) {
    let theDocument = await this.getOne(documentId, userId);

    const { Document, Packer, Paragraph, TextRun } = docx;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(theDocument.aiResponse)],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      )
      .header('Content-Disposition', 'attachment; filename=documentExport.docx')
      .header('Content-Length', buffer.length);

    return res.send(buffer);
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

  async validateTemplateRequiredData(
    templateId: number,
    documentRequiredData: any,
  ) {
    let theTemplate = await this.templateService.getOne(templateId);
    let templateRequiredData = theTemplate.requiredData;

    if (!documentRequiredData) {
      if (!templateRequiredData || templateRequiredData.length === 0) {
        return true;
      } else {
        throw new UnprocessableEntityException('Missing template requiredData');
      }
    }

    let templateRequiredDataObject = templateRequiredData.map(
      (key) => key.name,
    );

    let requiredDataKeys = documentRequiredData.map((object) => object.key);

    templateRequiredDataObject.forEach((key) => {
      console.log('key:', key);

      if (!requiredDataKeys.includes(key)) {
        throw new UnprocessableEntityException('Missing template requiredData');
      }
    });
  }
}
