import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './user.model';

@Module({
  controllers: [UserController],
  providers: [UserService, UserModel],
  exports: [UserModel],
})
export class UserModule {}
