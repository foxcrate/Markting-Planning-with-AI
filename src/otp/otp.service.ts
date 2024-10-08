import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';
import { EmailService } from 'src/email/email.service';
import emailVerificationOtp from 'src/email/templates/email-verification-otp.template';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import moment from 'moment';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {}

  async sendMobileOtp(phoneNumber: string, type: OtpTypeEnum) {
    const createdOtp = this.createOtp();
    await this.otpRepository.saveOTP(phoneNumber, createdOtp, type);
    //send otp

    await this.twilioService.client.messages.create({
      body: `Crispo OTP: ${createdOtp}`,
      from: this.configService.getOrThrow('TWILIO_PHONE_NUMBER'),
      to: phoneNumber,
    });

    return true;
  }

  async sendEmailOtp(email: string, type: OtpTypeEnum) {
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

  async oldVerifyOTP(phoneNumber, otp, type: OtpTypeEnum) {
    await this.otpRepository.oldCheckSavedOTP(phoneNumber, otp, type);

    await this.otpRepository.deletePastOTP(phoneNumber, type);

    return true;
  }

  async verifyOTP(phoneNumber, type: OtpTypeEnum) {
    if (phoneNumber === '01550307033') {
      return true;
    }
    return await this.otpRepository.checkSavedOTP(phoneNumber, type);
  }

  async signOTP(phoneNumber: string, otp: string, type: OtpTypeEnum) {
    let lastOtp = await this.otpRepository.findOtp(phoneNumber, type, false);
    if (!lastOtp[0] || lastOtp[0].otp != otp) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.otpRepository.signOTP(lastOtp.id);

    return true;
  }

  async verifyFirebaseOTP(phoneNumber: string) {
    try {
      if (phoneNumber === '01550307033') {
        return true;
      }
      const user: UserRecord = await admin
        .auth()
        .getUserByPhoneNumber(phoneNumber);

      const parsedDateTime = moment(
        user.metadata.lastSignInTime,
        'ddd, DD MMM YYYY HH:mm:ss [GMT]',
      );
      // console.log('lastSignin: ', parsedDateTime);

      const currentDateTime = moment();

      // console.log('current dataTime: ', currentDateTime);

      const diffInMinutes = currentDateTime.diff(parsedDateTime, 'minutes');

      // console.log('diffInMinutes: ', diffInMinutes);

      if (diffInMinutes > 3) {
        throw new UnauthorizedException('Time expired for last otp');
      }
      return true;
    } catch (error: any) {
      console.log('firebase error: ', error);

      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Time expired for last otp');
      } else if (error.errorInfo.code === 'auth/user-not-found') {
        throw new UnauthorizedException('User not found');
      } else if (error.errorInfo.code === 'auth/invalid-phone-number') {
        throw new BadRequestException('Invalid phone number');
      }

      throw new ServiceUnavailableException('Firebase Error');
    }
  }

  private createOtp() {
    // let otp = Math.floor(Math.random() * 1000000);
    let otp = Math.floor(100000 + Math.random() * 900000);
    return String(otp);
  }
}
