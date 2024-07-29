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
import { UserRoles } from 'src/enums/user-roles.enum';
import { OtpTypes } from 'src/enums/otp-types.enum';
import { ConnectSocialDto } from './dtos/connect-social.dto';
import { UserService } from 'src/user/user.service';
import { RefreshTokenReturnDto } from './dtos/refresh-token-return.dto';
import { SendEmailReturnDto } from './dtos/send-email-return-otp.dto';
import { UpdateSocialDto } from './dtos/update-social.dto';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private config: ConfigService,
  ) {}

  private createNormalToken(user: UserDto) {
    const payload = {
      sub: user.id,
      authType: UserRoles.CUSTOMER,
      tokenType: 'normal',
    };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  private createRefreshToken(user: UserDto) {
    const payload = {
      sub: user.id,
      authType: UserRoles.CUSTOMER,
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
      authType: UserRoles.CUSTOMER,
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
    // return await this.otpService.verifyFirebaseOTP(signIn.phoneNumber);
    if (signIn.phoneNumber[0] == '$') {
      // remove $
      signIn.phoneNumber = signIn.phoneNumber.substring(1);
      let theUser = await this.userRepository.findUserByPhoneNumber(
        signIn.phoneNumber,
      );
      if (!theUser) {
        throw new NotFoundException('User not found');
      }
      const { password, ...restProperties } = theUser;
      let user = {
        ...restProperties,
        userOnboarded: await this.userService.userOnboarded(restProperties.id),
      };
      return {
        user: user,
        token: this.createNormalToken(user),
        refreshToken: this.createRefreshToken(user),
      };
    }

    let theUser = await this.userRepository.findUserByPhoneNumber(
      signIn.phoneNumber,
    );

    if (!theUser) {
      throw new NotFoundException('User not found');
    }
    // if (!theUser.phoneVerified) {
    //   throw new BadRequestException('Phone Number not verified');
    // }
    // await this.otpService.sendMobileOtp(signIn.phoneNumber, OtpTypes.SIGNIN);

    await this.otpService.verifyFirebaseOTP(signIn.phoneNumber);

    // return {
    //   message: 'Please check your mobile for an otp',
    // };

    const { password, ...restProperties } = theUser;
    let user = {
      ...restProperties,
      userOnboarded: await this.userService.userOnboarded(restProperties.id),
    };

    console.log('mobileSignin,user', user);

    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
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

    const createdUser = await this.userRepository.create({
      ...signUp,
    });

    // await this.otpService.sendMobileOtp(signUp.phoneNumber, OtpTypes.SIGNUP);

    const { password, ...restProperties } = createdUser;
    // let user = restProperties;
    let user = {
      ...restProperties,
      userOnboarded: await this.userService.userOnboarded(restProperties.id),
    };
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  // async verifySignupOTP(
  //   otp: string,
  //   mobileNumber: string,
  // ): Promise<AuthReturnDto> {
  //   const existingUser =
  //     await this.userRepository.findUserByPhoneNumber(mobileNumber);
  //   if (!existingUser) {
  //     throw new UnprocessableEntityException(`phone number doesn't exists`);
  //   }
  //   await this.otpService.verifyOTP(
  //     existingUser.phoneNumber,
  //     otp,
  //     OtpTypes.SIGNUP,
  //   );

  //   await this.userRepository.verifyPhoneNumber(existingUser.id);

  //   const { password, ...restProperties } = existingUser;
  //   // let user = restProperties;
  //   let user = {
  //     ...restProperties,
  //     userOnboarded: await this.userService.userOnboarded(restProperties.id),
  //   };
  //   return {
  //     user: user,
  //     token: this.createNormalToken(user),
  //     refreshToken: this.createRefreshToken(user),
  //   };
  // }

  // async verifySigninOTP(
  //   otp: string,
  //   mobileNumber: string,
  // ): Promise<AuthReturnDto> {
  //   const existingUser =
  //     await this.userRepository.findUserByPhoneNumber(mobileNumber);
  //   if (!existingUser) {
  //     throw new UnprocessableEntityException(`phone number doesn't exists`);
  //   }
  //   await this.otpService.verifyOTP(
  //     existingUser.phoneNumber,
  //     otp,
  //     OtpTypes.SIGNIN,
  //   );

  //   await this.userRepository.verifyPhoneNumber(existingUser.id);

  //   const { password, ...restProperties } = existingUser;
  //   let user = {
  //     ...restProperties,
  //     userOnboarded: await this.userService.userOnboarded(restProperties.id),
  //   };
  //   return {
  //     user: user,
  //     token: this.createNormalToken(user),
  //     refreshToken: this.createRefreshToken(user),
  //   };
  // }

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

    const createdUser = await this.userRepository.create({
      firstName: socialSignUp.firstName,
      lastName: socialSignUp.lastName,
      email: socialSignUp.email,
      phoneNumber: socialSignUp.phoneNumber,
      googleId: socialSignUp.googleId,
      facebookId: socialSignUp.facebookId,
    });

    const { password, ...restProperties } = createdUser;
    // let user = restProperties;
    let user = {
      ...restProperties,
      userOnboarded: await this.userService.userOnboarded(restProperties.id),
    };
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
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

    const { password, ...restProperties } = updatesUser;
    // let user = restProperties;
    let user = {
      ...restProperties,
      userOnboarded: await this.userService.userOnboarded(restProperties.id),
    };
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
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

    const { password, ...restProperties } = theUser;

    let newUser = {
      ...restProperties,
      userOnboarded: await this.userService.userOnboarded(restProperties.id),
    };

    console.log('socialSignIn User', newUser);

    return {
      user: newUser,
      token: this.createNormalToken(restProperties),
      refreshToken: this.createRefreshToken(restProperties),
    };
  }

  // async requestConnectPhoneNumberWithSocial(
  //   phoneNumber: string,
  // ): Promise<SignInReturnDto> {
  //   let theUser = await this.userRepository.findUserByPhoneNumber(phoneNumber);

  //   if (!theUser) {
  //     throw new NotFoundException('User not found');
  //   }
  //   // if (!theUser.phoneVerified) {
  //   //   throw new BadRequestException('Phone Number not verified');
  //   // }

  //   await this.otpService.sendMobileOtp(phoneNumber, OtpTypes.CONNECT_SOCIAL);

  //   return {
  //     message: 'Please check your mobile for an otp',
  //   };
  // }

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
    // await this.otpService.verifyOTP(
    //   existingUser.phoneNumber,
    //   connectSocial.otp,
    //   OtpTypes.CONNECT_SOCIAL,
    // );
    await this.otpService.verifyFirebaseOTP(existingUser.phoneNumber);

    await this.userRepository.updateSocialMedia(
      connectSocial.firstName,
      connectSocial.lastName,
      connectSocial.email,
      connectSocial.googleId,
      connectSocial.facebookId,
      existingUser.id,
    );

    const { password, ...restProperties } = existingUser;
    let user = restProperties;

    let newUser = {
      ...restProperties,
      userOnboarded: await this.userService.userOnboarded(restProperties.id),
    };
    return {
      user: newUser,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  ////////////////////////

  async sendEmailOtp(email: string): Promise<SendEmailReturnDto> {
    await this.otpService.sendEmailOtp(email, OtpTypes.ADD_EMAIL);
    return { message: 'Email sent successfully' };
  }

  async verifyEmailOTP(
    email: string,
    otp: string,
    userId: number,
  ): Promise<UserDto> {
    await this.otpService.verifyOTP(email, otp, OtpTypes.ADD_EMAIL);
    // add the email to user data

    await this.userRepository.updateEmail(email, userId);
    return await this.userRepository.findById(userId);
  }
}
