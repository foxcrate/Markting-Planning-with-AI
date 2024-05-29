import fastify, { FastifyRequest } from 'fastify';
import { UploadFile } from './file/interceptors/multipart.interceptor';

declare module 'fastify' {
  interface FastifyRequest {
    uploads: UploadFile[] | undefined;
  }
}
