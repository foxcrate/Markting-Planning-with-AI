import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserDto } from './dtos/user.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { OtpService } from 'src/otp/otp.service';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';
import { MessageReturnDto } from '../dtos/message-return.dto';
import { UserCreateForAdminDto } from './dtos/admin/user-create-for-admin.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { RoleService } from 'src/role/role.service';
import { UserUpdateForAdminDto } from './dtos/admin/user-update-for-admin.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceService: WorkspaceService,
    private readonly otpService: OtpService,
    private readonly roleService: RoleService,
  ) {}
  async userUpdate(
    UpdateProfileBody: UpdateProfileDto,
    userId,
  ): Promise<UserDto> {
    return await this.userRepository.update(UpdateProfileBody, userId);
  }

  async delete(userId: number): Promise<UserDto> {
    return await this.userRepository.delete(userId);
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

  async changeEmail(contactEmail: string): Promise<MessageReturnDto> {
    const existingUser =
      await this.userRepository.findUserByCommunicateEmail(contactEmail);
    if (existingUser) {
      throw new UnprocessableEntityException(`email already exists`);
    }

    await this.otpService.sendEmailOtp(contactEmail, OtpTypeEnum.CHANGE_EMAIL);

    return {
      message: 'Please check your new email for an otp',
    };
  }

  async verifyChangeEmailOTP(
    newCommunicateEmail: string,
    otp: string,
    userId: number,
  ): Promise<MessageReturnDto> {
    await this.otpService.verifyOTP(
      newCommunicateEmail,
      otp,
      OtpTypeEnum.CHANGE_EMAIL,
    );

    await this.userRepository.updateCommunicateEmail(
      newCommunicateEmail,
      userId,
    );

    return {
      message: 'Email updated successfully',
    };
  }

  async adminCreate(
    reqBody: UserCreateForAdminDto,
    adminId: number,
  ): Promise<UserDto> {
    //validate createrUserType
    let adminUser = await this.userRepository.findById(adminId);

    if (reqBody.type === UserRoleEnum.ADMIN) {
      if (adminUser.type !== UserRoleEnum.ADMIN) {
        throw new UnauthorizedException('Only admin can create admin');
      }
    }

    //validate roleId if createdUser type is moderator
    if (reqBody.type === UserRoleEnum.MODERATOR) {
      if (!reqBody.roleId) {
        throw new UnprocessableEntityException(
          'roleId is required when creating a moderator',
        );
      }
    }

    //validate existence of the role
    await this.roleService.getOne(reqBody.roleId);

    //validate repeated phone number
    const existingUser = await this.userRepository.findUserByPhoneNumber(
      reqBody.phoneNumber,
    );
    if (existingUser) {
      throw new BadRequestException('phone number already exists');
    }

    //validate repeated email
    const existingEmail = await this.userRepository.findUserByCommunicateEmail(
      reqBody.contactEmail,
    );
    if (existingEmail) {
      throw new BadRequestException('email already exists');
    }

    //create stripeId

    //create user

    let createdUser = await this.userRepository.create(reqBody);

    return createdUser;
  }

  async adminUpdate(
    userId: number,
    reqBody: UserUpdateForAdminDto,
    adminId: number,
  ): Promise<UserDto> {
    let adminUser = await this.userRepository.findById(adminId);

    let theChangedUser = await this.userRepository.findById(userId);

    if (theChangedUser.type === UserRoleEnum.ADMIN) {
      if (adminUser.type !== UserRoleEnum.ADMIN) {
        throw new UnauthorizedException('Only admin can create admin');
      }
    }

    if (reqBody.type) {
      if (reqBody.type === UserRoleEnum.MODERATOR) {
        if (!reqBody.roleId) {
          throw new UnprocessableEntityException(
            'roleId is required when creating a moderator',
          );
        }
      }
    }

    if (reqBody.roleId) {
      //validate existence of the role
      await this.roleService.getOne(reqBody.roleId);
    }

    if (reqBody.phoneNumber) {
      //validate repeated phone number
      const existingUser = await this.userRepository.findUserByPhoneNumber(
        reqBody.phoneNumber,
      );
      if (existingUser) {
        if (existingUser.id !== Number(userId)) {
          throw new BadRequestException('phone number already exists');
        }
      }
    }

    if (reqBody.contactEmail) {
      //validate repeated email
      const existingEmail =
        await this.userRepository.findUserByCommunicateEmail(
          reqBody.contactEmail,
        );
      if (existingEmail) {
        if (existingEmail.id !== Number(userId)) {
          throw new BadRequestException('email already exists');
        }
      }
    }

    let updatedUser = await this.userRepository.update(reqBody, userId);

    return updatedUser;
  }

  async adminDelete(userId: number, adminId: number): Promise<UserDto> {
    let adminUser = await this.userRepository.findById(adminId);

    let theChangedUser = await this.userRepository.findById(userId);

    if (theChangedUser.type === UserRoleEnum.ADMIN) {
      if (adminUser.type !== UserRoleEnum.ADMIN) {
        throw new UnauthorizedException('Only admin can delete admin');
      }
    }

    let deletedUser = await this.userRepository.findById(userId);

    await this.userRepository.delete(userId);

    return deletedUser;
  }

  async adminGetOne(userId: number, adminId: number): Promise<UserDto> {
    let theDesiredUser = await this.userRepository.findById(userId);

    return theDesiredUser;
  }

  async adminGetAll(adminId: number): Promise<UserDto[]> {
    let allUsers = await this.userRepository.findAll();

    return allUsers;
  }

  async adminBlock(userId: number, adminId: number): Promise<UserDto> {
    let theBlockedUser = await this.userRepository.findById(userId);

    if (theBlockedUser.type === UserRoleEnum.ADMIN) {
      throw new UnauthorizedException("You can't block an admin");
    }

    if (theBlockedUser.blocked == true) {
      await this.userRepository.update({ blocked: false }, theBlockedUser.id);
    } else if (theBlockedUser.blocked == false) {
      await this.userRepository.update({ blocked: true }, theBlockedUser.id);
    }

    let theUpdatedUser = await this.userRepository.findById(userId);

    return theUpdatedUser;
  }
}
