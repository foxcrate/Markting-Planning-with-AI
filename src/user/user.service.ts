import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserDto } from './dtos/user.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { OtpService } from 'src/otp/otp.service';
import { OtpTypes } from 'src/enums/otp-types.enum';
import { MessageReturnDto } from '../dtos/message-return.dto';

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

  async getUserData(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async userOnboarded(userId: number): Promise<boolean> {
    return await this.workspaceService.userHasConfirmedWorkspace(userId);
  }

  async changePhoneNumber(
    phoneNumber: string,
    newPhoneNumber: string,
    userId: number,
  ): Promise<MessageReturnDto> {
    const existingUser =
      await this.userRepository.findUserByPhoneNumber(newPhoneNumber);
    if (existingUser) {
      throw new UnprocessableEntityException(`new phone number already exists`);
    }

    await this.otpService.verifyFirebaseOTP(newPhoneNumber);

    await this.userRepository.updatePhoneNumber(newPhoneNumber, userId);

    return {
      message: 'Phone Number updated successfully',
    };
  }

  // async verifyChangePhoneNumberOTP(
  //   newPhoneNumber: string,
  //   otp: string,
  //   userId: number,
  // ): Promise<MessageReturnDto> {
  //   await this.otpService.verifyOTP(
  //     newPhoneNumber,
  //     otp,
  //     OtpTypes.CHANGE_PHONE_NUMBER,
  //   );

  //   await this.userRepository.updatePhoneNumber(newPhoneNumber, userId);

  //   return {
  //     message: 'Phone Number updated successfully',
  //   };
  // }

  async changeEmail(email: string): Promise<MessageReturnDto> {
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
  ): Promise<MessageReturnDto> {
    await this.otpService.verifyOTP(newEmail, otp, OtpTypes.CHANGE_EMAIL);

    await this.userRepository.updateEmail(newEmail, userId);

    return {
      message: 'Email updated successfully',
    };
  }
}
