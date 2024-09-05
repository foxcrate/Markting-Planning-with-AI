import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { OtpModule } from 'src/otp/otp.module';
import { UserAdminController } from './user-admin.controller';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [UserController, UserAdminController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService],
  imports: [WorkspaceModule, OtpModule, RoleModule],
})
export class UserModule {}
