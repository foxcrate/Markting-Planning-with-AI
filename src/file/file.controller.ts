import { Controller, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { pipeline } from 'node:stream';
import util from 'node:util';
import { MultipartInterceptor } from './interceptors/multipart.interceptor';
import { join } from 'node:path';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { UploadImageReturnDto } from './dtos/upload-image-return.dto';
const pump = util.promisify(pipeline);

/**
 * technically both endpoint are the same but they are there for backward compatibility
 */

@Controller({ path: 'upload', version: '1' })
export class FileController {
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: UploadImageReturnDto,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Upload Image')
  @Post('images')
  @UseInterceptors(MultipartInterceptor(join(process.cwd(), 'public/uploads')))
  uploadImages(@Req() req: FastifyRequest): UploadImageReturnDto[] {
    return req.uploads;
  }

  // @Post('files')
  // @UseInterceptors(MultipartInterceptor(join(process.cwd(), 'public/uploads')))
  // uploadFile(@Req() req: FastifyRequest) {
  //   return req.uploads;
  // }
}
