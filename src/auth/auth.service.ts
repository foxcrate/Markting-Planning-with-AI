import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserDto } from '../user/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/otp/otp.service';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { AuthReturnDto } from './dtos/auth-return.dto';
import axios from 'axios';
import { SocialSignUpDto } from './dtos/social-signup.dto';
import { SocialSignInDto } from './dtos/social-signin.dto';
import { MobileSignInDto } from './dtos/mobile-signin.dto';
import { MobileSignUpDto } from './dtos/mobile-signup.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';
import { ConnectSocialDto } from './dtos/connect-social.dto';
import { UserService } from 'src/user/user.service';
import { RefreshTokenReturnDto } from './dtos/refresh-token-return.dto';
import { SendEmailReturnDto } from './dtos/send-email-return-otp.dto';
import { UpdateSocialDto } from './dtos/update-social.dto';
import { PermissionsCreateDto } from 'src/role/dtos/permission-create.dto';
import { PermissionDictionary } from 'src/role/permission.dictionary';
import { AuthUserDto } from 'src/user/dtos/auth-user.dto';
import { SettingService } from 'src/settings/setting.service';
import { SettingsEnum } from 'src/enums/settings.enum';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly settingService: SettingService,
    private readonly stripeService: StripeService,
    private config: ConfigService,
  ) {}

  private createNormalToken(user: UserDto) {
    const payload = {
      sub: user.id,
      authType: user.type,
      tokenType: 'normal',
    };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  private createRefreshToken(user: UserDto) {
    const payload = {
      sub: user.id,
      authType: user.type,
      tokenType: 'refresh',
    };
    return this.jwtService.sign(payload, {
      expiresIn: '90d',
    });
  }

  verifyRefreshToken(token: string): AuthTokenDto {
    try {
      const decoded = this.jwtService.verify(
        token,
        this.config.get('JWT_SECRET'),
      );
      return decoded;
    } catch (error) {
      // console.log('error in auth guard:', error);

      return {
        sub: null,
        tokenType: null,
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenReturnDto> {
    let payload: any = this.verifyRefreshToken(refreshToken);

    if (payload.sub == null) {
      throw new UnauthorizedException('Wrong Credentials');
    }
    if (payload.tokenType != 'refresh') {
      throw new UnauthorizedException('Wrong Credentials');
    }

    let tokenPayload = {
      sub: payload.sub,
      authType: UserRoleEnum.CUSTOMER,
      tokenType: 'normal',
    };

    const user = await this.userRepository.findById(payload.sub);

    return {
      user: user,
      token: this.jwtService.sign(tokenPayload, {
        expiresIn: '7d',
      }),
    };
  }

  /////////////////// Mobile Auth //////////////////////////

  async mobileSignIn(signIn: MobileSignInDto): Promise<AuthReturnDto> {
    if (signIn.phoneNumber[0] == '$') {
      // remove $
      signIn.phoneNumber = signIn.phoneNumber.substring(1);
      let theUser = await this.userRepository.findUserByPhoneNumber(
        signIn.phoneNumber,
      );
      if (!theUser) {
        throw new NotFoundException('User not found');
      }

      let userData = await this.getUserAdditionalData(theUser);

      return {
        user: userData,
        token: this.createNormalToken(theUser),
        refreshToken: this.createRefreshToken(theUser),
      };
    }

    let theUser = await this.userRepository.findUserByPhoneNumber(
      signIn.phoneNumber,
    );

    if (!theUser) {
      throw new NotFoundException('User not found');
      // throw new HttpException('Forbidden', HttpStatus.SEE_OTHER);
    }

    //check blocked user
    if (theUser.blocked) {
      throw new UnauthorizedException('User is blocked');
    }

    await this.otpService.verifyFirebaseOTP(signIn.phoneNumber);

    let userData = await this.getUserAdditionalData(theUser);

    // console.log('mobileSignin,user', userData);

    return {
      user: userData,
      token: this.createNormalToken(theUser),
      refreshToken: this.createRefreshToken(theUser),
    };
  }

  async mobileSignUp(signUp: MobileSignUpDto): Promise<AuthReturnDto> {
    const existingUser = await this.userRepository.findUserByPhoneNumber(
      signUp.phoneNumber,
    );
    if (existingUser) {
      throw new BadRequestException('phone number already exists');
    }

    await this.otpService.verifyFirebaseOTP(signUp.phoneNumber);

    let userStartCoins = (
      await this.settingService.getOneByName(SettingsEnum.USER_START_COINS)
    ).value;

    const stripeCustomer = await this.stripeService.createCustomer(
      signUp.firstName + ' ' + signUp.lastName,
      null,
      signUp.phoneNumber,
    );

    const createdUser = await this.userRepository.create({
      ...signUp,
      credits: Number(userStartCoins),
      stripeCustomerId: stripeCustomer.id,
    });

    let userData = await this.getUserAdditionalData(createdUser);

    return {
      user: userData,
      token: this.createNormalToken(createdUser),
      refreshToken: this.createRefreshToken(createdUser),
    };
  }

  async sendPhoneOtp(phoneNumber: string, type: OtpTypeEnum): Promise<Boolean> {
    return await this.otpService.sendMobileOtp(phoneNumber, type);
  }

  async verifyPhoneOTP(
    phoneNumber: string,
    type: OtpTypeEnum,
  ): Promise<Boolean> {
    return await this.otpService.verifyOTP(phoneNumber, type);
  }

  async signPhoneOTP(
    phoneNumber: string,
    otp: string,
    type: OtpTypeEnum,
  ): Promise<Boolean> {
    return await this.otpService.signOTP(phoneNumber, otp, type);
  }

  async checkSavedPhone(phoneNumber: string): Promise<boolean> {
    let foundedUser =
      await this.userRepository.findUserByPhoneNumber(phoneNumber);

    if (foundedUser) {
      return true;
    }
    return false;
  }

  /////////////////// Social Auth  //////////////////////

  async getGoogleUserData(access_token: string) {
    try {
      const { data } = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return data;
    } catch (err) {
      console.log('error in getGoogleUserData() --', err);

      throw new UnprocessableEntityException('Google token error');
    }
  }

  async getFacebookUserData(access_token) {
    try {
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(
            ',',
          ),
          access_token: access_token,
        },
      });
      return data;
    } catch (err) {
      console.log('error in getFacebookUserData() --', err);

      throw new UnprocessableEntityException('Facebook token error');
    }
  }

  async socialSignUp(socialSignUp: SocialSignUpDto) {
    if (!socialSignUp.facebookId && !socialSignUp.googleId) {
      throw new UnprocessableEntityException(
        'Please provide a social id (facebookId or googleId)',
      );
    }

    if (socialSignUp.facebookId && socialSignUp.googleId) {
      throw new UnprocessableEntityException(
        'Please provide either facebookId or googleId',
      );
    }

    //validate if user exists
    if (socialSignUp.googleId) {
      if (
        await this.userRepository.findUsersByGoogleId(socialSignUp.googleId)
      ) {
        throw new UnprocessableEntityException(
          'Google Social Account already exists',
        );
      }
    } else if (socialSignUp.facebookId) {
      if (
        await this.userRepository.findUsersByFacebookId(socialSignUp.facebookId)
      ) {
        throw new UnprocessableEntityException(
          'Facebook Social Account already exists',
        );
      }
    }

    await this.otpService.verifyFirebaseOTP(socialSignUp.phoneNumber);

    //check existing phone number
    let userWithSamePhone = await this.userRepository.findUserByPhoneNumber(
      socialSignUp.phoneNumber,
    );
    if (userWithSamePhone) {
      // throw new UnprocessableEntityException('Phone number already exists');
      if (userWithSamePhone.googleId || userWithSamePhone.facebookId) {
        throw new UnprocessableEntityException(
          'Social Account already connected to this phone',
        );
      } else {
        return {
          message:
            'Phone number already exist. connect it to this social media?',
          code: 'CONNECT_PHONE_NUMBER',
        };
      }
    }

    let userStartCoins = (
      await this.settingService.getOneByName(SettingsEnum.USER_START_COINS)
    ).value;

    const stripeCustomer = await this.stripeService.createCustomer(
      socialSignUp.firstName + ' ' + socialSignUp.lastName,
      socialSignUp.authEmail,
      socialSignUp.phoneNumber,
    );

    const createdUser = await this.userRepository.create({
      firstName: socialSignUp.firstName,
      lastName: socialSignUp.lastName,
      authEmail: socialSignUp.authEmail,
      contactEmail: socialSignUp.authEmail,
      phoneNumber: socialSignUp.phoneNumber,
      googleId: socialSignUp.googleId,
      facebookId: socialSignUp.facebookId,
      credits: Number(userStartCoins),
      stripeCustomerId: stripeCustomer.id,
    });

    let userData = await this.getUserAdditionalData(createdUser);
    return {
      user: userData,
      token: this.createNormalToken(createdUser),
      refreshToken: this.createRefreshToken(createdUser),
    };
  }

  async updateSocial(updateSocial: UpdateSocialDto, userId: number) {
    if (!updateSocial.facebookId && !updateSocial.googleId) {
      throw new UnprocessableEntityException(
        'Please provide a social id (facebookId or googleId)',
      );
    }

    if (updateSocial.facebookId && updateSocial.googleId) {
      throw new UnprocessableEntityException(
        'Please provide either facebookId or googleId',
      );
    }

    //validate if user exists
    if (updateSocial.googleId) {
      if (
        await this.userRepository.findUsersByGoogleId(updateSocial.googleId)
      ) {
        throw new UnprocessableEntityException(
          'Google Social Account already exists',
        );
      }
    } else if (updateSocial.facebookId) {
      if (
        await this.userRepository.findUsersByFacebookId(updateSocial.facebookId)
      ) {
        throw new UnprocessableEntityException(
          'Facebook Social Account already exists',
        );
      }
    }

    const updatesUser = await this.userRepository.updateSocial(
      updateSocial,
      userId,
    );

    let userData = await this.getUserAdditionalData(updatesUser);

    return {
      user: userData,
      token: this.createNormalToken(updatesUser),
      refreshToken: this.createRefreshToken(updatesUser),
    };
  }

  async socialSignIn(signInData: SocialSignInDto): Promise<AuthReturnDto> {
    if (!signInData.facebookId && !signInData.googleId) {
      throw new UnprocessableEntityException(
        'Please provide a social id (facebookId or googleId)',
      );
    }

    if (signInData.facebookId && signInData.googleId) {
      throw new UnprocessableEntityException(
        'Please provide either facebookId or googleId',
      );
    }

    let theUser = await this.userRepository.findUserBySocialIds(
      signInData.googleId,
      signInData.facebookId,
    );

    if (!theUser) {
      throw new NotFoundException('User not found');
    }

    //check blocked user
    if (theUser.blocked) {
      throw new UnauthorizedException('User is blocked');
    }

    // console.log('socialSignIn User', theUser);

    let userData = await this.getUserAdditionalData(theUser);

    return {
      user: userData,
      token: this.createNormalToken(theUser),
      refreshToken: this.createRefreshToken(theUser),
    };
  }

  async connectSocial(connectSocial: ConnectSocialDto): Promise<AuthReturnDto> {
    if (!connectSocial.facebookId && !connectSocial.googleId) {
      throw new UnprocessableEntityException(
        'Please provide a social id (facebookId or googleId)',
      );
    }

    if (connectSocial.facebookId && connectSocial.googleId) {
      throw new UnprocessableEntityException(
        'Please provide either facebookId or googleId',
      );
    }

    // connectSocial.
    const existingUser = await this.userRepository.findUserByPhoneNumber(
      connectSocial.mobileNumber,
    );
    if (!existingUser) {
      throw new UnprocessableEntityException(`phone number doesn't exists`);
    }

    await this.otpService.verifyFirebaseOTP(existingUser.phoneNumber);

    await this.userRepository.updateSocialMedia(
      connectSocial.firstName,
      connectSocial.lastName,
      connectSocial.authEmail,
      connectSocial.googleId,
      connectSocial.facebookId,
      existingUser.id,
    );

    let updatedUser = await this.userRepository.findUserByPhoneNumber(
      connectSocial.mobileNumber,
    );

    let userData = await this.getUserAdditionalData(updatedUser);

    return {
      user: userData,
      token: this.createNormalToken(updatedUser),
      refreshToken: this.createRefreshToken(updatedUser),
    };
  }

  ////////////////////////

  async sendEmailOtp(contactEmail: string): Promise<SendEmailReturnDto> {
    await this.otpService.sendEmailOtp(contactEmail, OtpTypeEnum.ADD_EMAIL);
    return { message: 'Email sent successfully' };
  }

  async verifyEmailOTP(
    contactEmail: string,
    otp: string,
    userId: number,
  ): Promise<UserDto> {
    await this.otpService.oldVerifyOTP(
      contactEmail,
      otp,
      OtpTypeEnum.ADD_EMAIL,
    );
    // add the email to user data

    await this.userRepository.updateCommunicateEmail(contactEmail, userId);
    return await this.userRepository.findById(userId);
  }

  async getUserAdditionalData(user: UserDto): Promise<AuthUserDto> {
    return {
      ...user,
      // userPermissions: this.getUserPermissions(user),
      userOnboarded: await this.userService.userOnboarded(user.id),
    };
  }

  getUserPermissions(theUser: UserDto): PermissionsCreateDto {
    let userPermissions;
    if (theUser.type == UserRoleEnum.CUSTOMER) {
      userPermissions = this.createAllPermissions(PermissionDictionary, false);
    } else if (theUser.type == UserRoleEnum.ADMIN) {
      userPermissions = this.createAllPermissions(PermissionDictionary, true);
    } else if (theUser.type == UserRoleEnum.MODERATOR) {
      // console.log({ theUser });

      userPermissions = theUser.role.permissions;
    }
    return userPermissions;
  }

  createAllPermissions(permissionDict, value: boolean) {
    const result = {};

    Object.keys(permissionDict).forEach((resource) => {
      result[resource] = {};
      Object.keys(permissionDict[resource]).forEach((permission) => {
        result[resource][permission] = value;
      });
    });

    return result;
  }
}
