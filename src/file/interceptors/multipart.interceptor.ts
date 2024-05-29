import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
// import { promisify } from 'util';
// import { pipeline } from 'stream';
import { join } from 'path';
import { randomBytes } from 'crypto';
import mimetypes from 'mime-types';
import { MultipartFile } from '@fastify/multipart';
import { writeFile } from 'fs/promises';

// const pump = promisify(pipeline);

export type UploadFile = {
  filename: string;
  path: string;
};

export function MultipartInterceptor(path: string) {
  @Injectable()
  class MultipartInterceptor implements NestInterceptor {
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
      return new Promise(async (resolve, reject) => {
        try {
          const httpCtx = context.switchToHttp();
          const req = httpCtx.getRequest<FastifyRequest>();
          if (!req.isMultipart()) {
            throw new BadRequestException('Request is not multipart/form-data');
          }
          let noneFilefields: Record<string, any>;
          const files: UploadFile[] = [];
          let i = 0;
          for await (const file of req.files()) {
            const buff = await file.toBuffer();
            const { path } = await this.saveFileToPath(buff, file.mimetype);
            files.push({ filename: file.filename, path });
            if (i === 0) {
              noneFilefields = this.extractNoneFileFields(file);
            }
            i++;
          }
          req['uploads'] = files;
          req.body = noneFilefields;
          resolve(next.handle());
        } catch (error) {
          reject(error);
        }
      });
    }

    async saveFileToPath(buff: Buffer, mimetype: string) {
      const newFilename = `${randomBytes(16).toString('hex')}${new Date().getTime()}.${mimetypes.extension(mimetype)}`;
      // await pump(file.file, createWriteStream(join(path, newFilename)));
      await writeFile(join(path, newFilename), buff);
      return { path: `public/uploads/${newFilename}` };
    }

    //this needs to be executed once
    extractNoneFileFields(file: MultipartFile) {
      const obj: Record<string, any> = {};
      const fields = file.fields;
      for (const [key, value] of Object.entries(fields)) {
        if (!Array.isArray(value)) {
          if (value.type === 'field') {
            obj[key] = value.value;
          }
        }
      }
      return obj;
    }
  }
  return MultipartInterceptor;
}
