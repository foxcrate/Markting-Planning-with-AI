import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpTypes } from 'src/enums/otp-types.enum';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  async sendOtp(phoneNumber: string, type: OtpTypes) {
    // const createdOtp = this.createOtp();
    const createdOtp = '12345';
    await this.otpRepository.saveOTP(phoneNumber, createdOtp, type);
    //send otp
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
