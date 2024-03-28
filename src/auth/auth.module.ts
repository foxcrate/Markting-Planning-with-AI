import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { UserModule } from 'src/user/user.module';
import { FacebookAuthService } from './facebook-auth.service';
import { EmailModule } from 'src/email/email.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  providers: [AuthService, GoogleAuthService, FacebookAuthService],
  controllers: [AuthController],
  imports: [UserModule, EmailModule, OpenAiModule],
})
export class AuthModule {}
