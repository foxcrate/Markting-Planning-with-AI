import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpTypes } from 'src/enums/otp-types.enum';
import { EmailService } from 'src/email/email.service';
import emailVerificationOtp from 'src/email/templates/email-verification-otp.template';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
  ) {}

  async sendMobileOtp(phoneNumber: string, type: OtpTypes) {
    // const createdOtp = this.createOtp();
    const createdOtp = '123456';
    await this.otpRepository.saveOTP(phoneNumber, createdOtp, type);
    //send otp
    return 'OTP sent successfully';
  }

  async sendEmailOtp(email: string, type: OtpTypes) {
    // const createdOtp = this.createOtp();
    const createdOtp = this.createOtp();
    await this.otpRepository.saveOTP(email, createdOtp, type);
    this.emailService.sendEmail(
      email,
      'Crespo Email Verification',
      emailVerificationOtp(createdOtp),
    );
    return 'OTP sent successfully';
  }

  async verifyOTP(phoneNumber, otp, type: OtpTypes) {
    //throw error if not passed
    await this.otpRepository.checkSavedOTP(phoneNumber, otp, type);

    await this.otpRepository.deletePastOTP(phoneNumber, type);

    return true;
  }

  private createOtp() {
    let otp = Math.floor(Math.random() * 1000000);
    return String(otp);
  }
}
