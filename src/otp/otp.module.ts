import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
  imports: [EmailModule],
})
export class OtpModule {}
