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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import admin from 'firebase-admin';

import * as serviceAccount from './crespo-c6266-firebase-adminsdk-61im5-d24b69bbf1.json';

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Crespo API')
    .addBearerAuth()
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      plugins: [
        (...args: any[]) => (window as any).HierarchicalTagsPlugin(...args),
        // This is added by nestjs by default and would be overridden if not included
        (...args: any[]) =>
          (window as any).SwaggerUIBundle.plugins.DownloadUrl(...args),
      ],
      hierarchicalTagSeparator: ':', // This must be a string, as RegExp will not survive being json encoded
    },
    customJs: ['https://unpkg.com/swagger-ui-plugin-hierarchical-tags'],
  });
  //

  // var serviceAccount = process.env.FIREBASE_ADMIN_AUTH_PATH;

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  // });

  const firebaseAdminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  console.log(firebaseAdminApp);

  await app.listen(process.env.APP_PORT || 3000, '0.0.0.0');

  process.on('beforeExit', async () => {
    await app.close();
  });
}
bootstrap();
