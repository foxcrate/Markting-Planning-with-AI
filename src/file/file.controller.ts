import { Controller, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
import { MultipartInterceptor } from './interceptors/multipart.interceptor';
import { join } from 'node:path';
const pump = util.promisify(pipeline);

/**
 * technically both endpoint are the same but they are there for backward compatibility
 */
@Controller({ path: 'upload', version: '1' })
export class FileController {
  @Post('images')
  @UseInterceptors(MultipartInterceptor(join(process.cwd(), 'public/uploads')))
  uploadImages(@Req() req: FastifyRequest) {
    return req.uploads;
  }

  @Post('files')
  @UseInterceptors(MultipartInterceptor(join(process.cwd(), 'public/uploads')))
  uploadFile(@Req() req: FastifyRequest) {
    return req.uploads;
  }
}
