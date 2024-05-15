import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  async sendOtp(phoneNumber: string) {
    // const createdOtp = this.createOtp();
    const createdOtp = '123456';
    await this.otpRepository.saveOTP(phoneNumber, createdOtp);
    //send otp
    return 'OTP sent successfully';
  }

  async verifyOTP(phoneNumber, otp) {
    //throw error if not passed
    await this.otpRepository.checkSavedOTP(phoneNumber, otp);

    await this.otpRepository.deletePastOTP(phoneNumber);

    return true;
  }

  private createOtp() {
    let otp = Math.floor(Math.random() * 1000000);
    return String(otp);
  }
}
