import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { DB_PROVIDER } from './constants';
import { Pool, PoolConfig, createPool } from 'mariadb';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { appendFile } from 'node:fs/promises';

@Global()
@Module({
  exports: [DB_PROVIDER],
  providers: [
    {
      provide: DB_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const config: PoolConfig = {
          port: configService.get('DB_PORT'),
          host: configService.get('DB_HOST'),
          user: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          connectionLimit: 15,
          connectTimeout: 15000,
          timezone: 'Z',
          collation: 'utf8mb4_unicode_ci',
          trace: true,
          charset: 'utf8mb4',
          bigIntAsNumber: true,
          dateStrings: true,
          debugLen: 9999999,
          logger: {
            error(err) {
              appendFile(
                join(process.cwd(), 'logs/db/error.log'),
                err.message,
                {
                  encoding: 'utf8',
                },
              );
            },
            query(msg) {
              appendFile(join(process.cwd(), 'logs/db/query.log'), msg, {
                encoding: 'utf8',
              });
            },
          },
        };
        const connection = createPool(config);
        return connection;
      },
      inject: [ConfigService],
    },
  ],
})
export class MariadbModule implements OnModuleDestroy {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async onModuleDestroy() {
    await this.db.end();
  }
}
