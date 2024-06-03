import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserDto } from './dtos/user.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { OtpService } from 'src/otp/otp.service';
import { OtpTypes } from 'src/enums/otp-types.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceService: WorkspaceService,
    private readonly otpService: OtpService,
  ) {}
  async update(UpdateProfileBody: UpdateProfileDto, userId): Promise<UserDto> {
    return await this.userRepository.update(UpdateProfileBody, userId);
  }

  async userOnboarded(userId: number): Promise<boolean> {
    return await this.workspaceService.userHasConfirmedWorkspace(userId);
  }

  async changePhoneNumber(phoneNumber: string): Promise<any> {
    const existingUser =
      await this.userRepository.findUserByPhoneNumber(phoneNumber);
    if (existingUser) {
      throw new UnprocessableEntityException(`phone number already exists`);
    }

    await this.otpService.sendMobileOtp(
      phoneNumber,
      OtpTypes.CHANGE_PHONE_NUMBER,
    );

    return {
      message: 'Please check your new mobile for an otp',
    };
  }

  async verifyChangePhoneNumberOTP(
    newPhoneNumber: string,
    otp: string,
    userId: number,
  ): Promise<any> {
    await this.otpService.verifyOTP(
      newPhoneNumber,
      otp,
      OtpTypes.CHANGE_PHONE_NUMBER,
    );

    await this.userRepository.updatePhoneNumber(newPhoneNumber, userId);

    return {
      message: 'Phone Number updated successfully',
    };
  }

  async changeEmail(email: string): Promise<any> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new UnprocessableEntityException(`email already exists`);
    }

    await this.otpService.sendEmailOtp(email, OtpTypes.CHANGE_EMAIL);

    return {
      message: 'Please check your new email for an otp',
    };
  }

  async verifyChangeEmailOTP(
    newEmail: string,
    otp: string,
    userId: number,
  ): Promise<any> {
    await this.otpService.verifyOTP(newEmail, otp, OtpTypes.CHANGE_EMAIL);

    await this.userRepository.updateEmail(newEmail, userId);

    return {
      message: 'Email updated successfully',
    };
  }
}
