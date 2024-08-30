import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MessageEntity } from './src/message/message.entity';
import { ThreadEntity } from './src/thread/thread.entity';
import { FunnelEntity } from './src/funnel/funnel.entity';
import { StageEntity } from './src/stage/stage.entity';
import { OtpEntity } from './src/otp/otp.entity';
import { TemplateEntity } from './src/template/template.entity';
import { WorkspaceEntity } from './src/workspace/workspace.entity';
import { GlobalStageEntity } from './src/global-stage/global-stage.entity';
import { TacticEntity } from './src/tactic/tactic.entity';
import { TacticStepEntity } from './src/tactic/tactic-step.entity';
import { TacticsStagesEntity } from './src/stage/tactics-stages.entity';
import { KpiEntity } from 'src/kpi/kpi.entity';
import { KpiEntryEntity } from 'src/kpi/kpi-entry.entity';
import { TemplateCategoryEntity } from 'src/template-category/template-category.entity';
import { DocumentEntity } from 'src/document/document.entity';
import { FlowEntity } from 'src/flow/flow.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { RoleEntity } from 'src/role/role.entity';
require('dotenv').config({
  path: `${process.env.NODE_ENV ? process.env.NODE_ENV : ''}.env`,
});

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
    KpiEntity,
    KpiEntryEntity,
    TemplateCategoryEntity,
    DocumentEntity,
    FlowEntity,
    CommentEntity,
    RoleEntity,
  ],
  //migrations: [__dirname + '/migrations/**/*'],
  //migrationsTableName: 'migrations',
  poolSize: 10,
};

export const typeOrmDataSource = new DataSource(
  typeOrmDbConfig as DataSourceOptions,
);
