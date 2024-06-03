import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService],
  imports: [WorkspaceModule,OtpModule],
})
export class UserModule {}
