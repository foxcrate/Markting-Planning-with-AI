import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();

export const typeOrmDbConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [UserEntity],
  migrations: [__dirname + '/migrations/**/*'],
  migrationsTableName: 'migrations',
  poolSize: 10,
};

export const typeOrmDataSource = new DataSource(
  typeOrmDbConfig as DataSourceOptions,
);
