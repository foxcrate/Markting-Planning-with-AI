import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MessageEntity } from './src/message/message.entity';
import { ThreadEntity } from './src/thread/thread.entity';
import { FunnelEntity } from './src/funnel/funnel.entity';
import { StageEntity } from './src/funnel/stage.entity';
import { OtpEntity } from './src/otp/otp.entity';
import { TemplateEntity } from './src/template/template.entity';
import { WorkspaceEntity } from './src/workspace/workspace.entity';
import { GlobalStageEntity } from './src/global-stage/global-stage.entity';
import { TacticEntity } from './src/tactic/tactic.entity';
import { TacticStepEntity } from './src/tactic/tactic-step.entity';
import { TacticsStagesEntity } from './src/funnel/tactics-stages.entity';
require('dotenv').config();

export const typeOrmDbConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [
    UserEntity,
    MessageEntity,
    ThreadEntity,
    FunnelEntity,
    StageEntity,
    OtpEntity,
    TemplateEntity,
    WorkspaceEntity,
    GlobalStageEntity,
    TacticEntity,
    TacticStepEntity,
    TacticsStagesEntity,
  ],
  migrations: [__dirname + '/migrations/**/*'],
  migrationsTableName: 'migrations',
  poolSize: 10,
};

export const typeOrmDataSource = new DataSource(
  typeOrmDbConfig as DataSourceOptions,
);
