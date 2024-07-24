import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmDbConfig } from 'ormconfig';
import { EmailModule } from './email/email.module';
import { MessageModule } from './message/message.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { ThreadModule } from './thread/thread.module';
import { FunnelModule } from './funnel/funnel.module';
import { OtpModule } from './otp/otp.module';
import { TemplateModule } from './template/template.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { GlobalStageModule } from './global-stage/global-stage.module';
import { TacticModule } from './tactic/tactic.module';
import { FileModule } from './file/file.module';
import { MariadbModule } from './db/mariadb.module';
import { StageModule } from './stage/stage.module';
import { KpiModule } from './kpi/kpi.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['local.env', '.env'],
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    TypeOrmModule.forRoot(typeOrmDbConfig),
    MariadbModule,
    FileModule,
    UserModule,
    AuthModule,
    EmailModule,
    MessageModule,
    OpenAiModule,
    ThreadModule,
    FunnelModule,
    OtpModule,
    TemplateModule,
    WorkspaceModule,
    GlobalStageModule,
    TacticModule,
    StageModule,
    KpiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
