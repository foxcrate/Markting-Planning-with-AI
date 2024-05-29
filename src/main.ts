import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { FastifyMultipartAttachFieldsToBodyOptions } from '@fastify/multipart';
import { FastifyStaticOptions } from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await app.register(require('@fastify/static'), {
    root: join(process.cwd(), 'public'),
  } as FastifyStaticOptions);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await app.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 2e7,
    },
  } as FastifyMultipartAttachFieldsToBodyOptions);

  await app.listen(process.env.APP_PORT || 3000, '0.0.0.0');

  process.on('beforeExit', async () => {
    await app.close();
  });
}
bootstrap();
