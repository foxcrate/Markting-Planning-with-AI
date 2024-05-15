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
import { SocialSignUp } from './dtos/social-signup.dto';
import { SocialSignIn } from './dtos/social_signin.dto';
import { MobileSignInDto } from './dtos/mobile-signin.dto';
import { MobileSignUpDto } from './dtos/mobile-signup.dto';
import { UserRoles } from 'src/enums/user-roles.enum';
import { OtpTypes } from 'src/enums/otp-types.enum';
import { VerifyConnectSocialOtpDto } from './dtos/verify-connect-social-otp.dto';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
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

  async refreshToken(
    refreshToken: string,
  ): Promise<{ user: UserDto; token: string }> {
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

  async mobileSignIn(signIn: MobileSignInDto): Promise<any> {
    let theUser = await this.userRepository.findUserByPhoneNumber(
      signIn.phoneNumber,
    );

    if (!theUser) {
      throw new NotFoundException('User not found');
    }
    // if (!theUser.phoneVerified) {
    //   throw new BadRequestException('Phone Number not verified');
    // }
    await this.otpService.sendOtp(signIn.phoneNumber, OtpTypes.SIGNIN);

    return {
      message: 'Please check your mobile for an otp',
    };
  }

  async mobileSignUp(
    signUp: MobileSignUpDto,
  ): Promise<{ user: UserDto; message: string }> {
    const existingUser = await this.userRepository.findUserByPhoneNumber(
      signUp.phoneNumber,
    );
    if (existingUser) {
      throw new BadRequestException('phone number already exists');
    }

    const createdUser = await this.userRepository.create({
      ...signUp,
    });

    await this.otpService.sendOtp(signUp.phoneNumber, OtpTypes.SIGNUP);

    return {
      user: createdUser,
      message: 'Please check your mobile for signup otp verification',
    };
  }

  async verifySignupOTP(
    otp: string,
    mobileNumber: string,
  ): Promise<AuthReturnDto> {
    const existingUser =
      await this.userRepository.findUserByPhoneNumber(mobileNumber);
    if (!existingUser) {
      throw new UnprocessableEntityException(`phone number doesn't exists`);
    }
    await this.otpService.verifyOTP(
      existingUser.phoneNumber,
      otp,
      OtpTypes.SIGNUP,
    );

    await this.userRepository.verifyPhoneNumber(existingUser.id);

    const { password, ...restProperties } = existingUser;
    let user = restProperties;
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  async verifySigninOTP(
    otp: string,
    mobileNumber: string,
  ): Promise<AuthReturnDto> {
    const existingUser =
      await this.userRepository.findUserByPhoneNumber(mobileNumber);
    if (!existingUser) {
      throw new UnprocessableEntityException(`phone number doesn't exists`);
    }
    await this.otpService.verifyOTP(
      existingUser.phoneNumber,
      otp,
      OtpTypes.SIGNIN,
    );

    await this.userRepository.verifyPhoneNumber(existingUser.id);

    const { password, ...restProperties } = existingUser;
    let user = restProperties;
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  /////////////////// Social Auth  //////////////////////

  async getGoogleUserData(access_token) {
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

  async socialSignUp(socialSignUp: SocialSignUp) {
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

    await this.otpService.sendOtp(socialSignUp.phoneNumber, OtpTypes.SIGNUP);

    return {
      user: createdUser,
      message: 'Please check your mobile for otp verification',
    };
  }

  async socialSignIn(signInData: SocialSignIn): Promise<AuthReturnDto> {
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

    return {
      user: restProperties,
      token: this.createNormalToken(restProperties),
      refreshToken: this.createRefreshToken(restProperties),
    };
  }

  async requestConnectPhoneNumberWithSocial(phoneNumber: string) {
    let theUser = await this.userRepository.findUserByPhoneNumber(phoneNumber);

    if (!theUser) {
      throw new NotFoundException('User not found');
    }
    if (!theUser.phoneVerified) {
      throw new BadRequestException('Phone Number not verified');
    }
    await this.otpService.sendOtp(phoneNumber, OtpTypes.CONNECT_SOCIAL);

    return {
      message: 'Please check your mobile for an otp',
    };
  }

  async verifyConnectSocialOTP(
    verifyConnectSocialOtp: VerifyConnectSocialOtpDto,
  ): Promise<AuthReturnDto> {
    if (
      !verifyConnectSocialOtp.facebookId &&
      !verifyConnectSocialOtp.googleId
    ) {
      throw new UnprocessableEntityException(
        'Please provide a social id (facebookId or googleId)',
      );
    }

    if (verifyConnectSocialOtp.facebookId && verifyConnectSocialOtp.googleId) {
      throw new UnprocessableEntityException(
        'Please provide either facebookId or googleId',
      );
    }

    // verifyConnectSocialOtp.
    const existingUser = await this.userRepository.findUserByPhoneNumber(
      verifyConnectSocialOtp.mobileNumber,
    );
    if (!existingUser) {
      throw new UnprocessableEntityException(`phone number doesn't exists`);
    }
    await this.otpService.verifyOTP(
      existingUser.phoneNumber,
      verifyConnectSocialOtp.otp,
      OtpTypes.CONNECT_SOCIAL,
    );

    await this.userRepository.updateSocialMedia(
      verifyConnectSocialOtp.firstName,
      verifyConnectSocialOtp.lastName,
      verifyConnectSocialOtp.email,
      verifyConnectSocialOtp.googleId,
      verifyConnectSocialOtp.facebookId,
      existingUser.id,
    );

    const { password, ...restProperties } = existingUser;
    let user = restProperties;
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  ////////////////////////
}

// async googleSignInUp(token: string): Promise<AuthReturnDto> {
//   const googleUser = await this.googleAuthService.verifyToken(token);
//   const existingUsers = await this.userRepository.findUsersByEmailOrGoogleId(
//     googleUser.email,
//     googleUser.googleId,
//   );
//   if (Array.isArray(existingUsers) && existingUsers.length) {
//     if (
//       existingUsers.length > 1 ||
//       existingUsers[0].email === googleUser.email
//     ) {
//       throw new UnprocessableEntityException(
//         'Found matching users with the same email',
//       );
//     }
//     const [user] = existingUsers;
//     return {
//       user: user,
//       token: this.createNormalToken(user),
//       refreshToken: this.createRefreshToken(user),
//     };
//   }
//   const createdUser = await this.userRepository.create({
//     firstName: googleUser.given_name,
//     lastName: googleUser.family_name,
//     email: googleUser.email,
//     googleId: googleUser.googleId,
//   });
//   return {
//     user: createdUser,
//     token: this.createNormalToken(createdUser),
//     refreshToken: this.createRefreshToken(createdUser),
//   };
// }

// async googleSignUp(token: string): Promise<AuthReturnDto> {
//   const googleUser = await this.googleAuthService.verifyToken(token);
//   const existingUser = await this.userRepository.findUsersByGoogleId(
//     googleUser.googleId,
//   );
//   if (existingUser) {
//     throw new UnprocessableEntityException(
//       'A user already registered with this google account',
//     );
//   }
//   const createdUser = await this.userRepository.create({
//     firstName: googleUser.given_name,
//     lastName: googleUser.family_name,
//     email: googleUser.email,
//     googleId: googleUser.googleId,
//   });
//   return {
//     user: createdUser,
//     token: this.createNormalToken(createdUser),
//     refreshToken: this.createRefreshToken(createdUser),
//   };
// }

// async googleSignIn(token: string): Promise<AuthReturnDto> {
//   const googleUser = await this.googleAuthService.verifyToken(token);
//   const existingUser = await this.userRepository.findUsersByGoogleId(
//     googleUser.googleId,
//   );
//   if (!existingUser) {
//     throw new UnprocessableEntityException(
//       'User not found with this google account',
//     );
//   }
//   const { password, ...restProperties } = existingUser;
//   return {
//     user: restProperties,
//     token: this.createNormalToken(restProperties),
//     refreshToken: this.createRefreshToken(restProperties),
//   };
// }

// async facebookSignInUp(token: string): Promise<AuthReturnDto> {
//   const facebookUser = await this.facebookAuthService.verifyToken(token);
//   const existingUsers =
//     await this.userRepository.findUsersByEmailOrFacebookId(
//       facebookUser.email,
//       facebookUser.facebookId,
//     );
//   if (Array.isArray(existingUsers) && existingUsers.length) {
//     if (
//       existingUsers.length > 1 ||
//       existingUsers[0].email === facebookUser.email
//     ) {
//       throw new UnprocessableEntityException(
//         'Found matching users with the same email',
//       );
//     }
//     const [user] = existingUsers;
//     return {
//       user: user,
//       token: this.createNormalToken(user),
//       refreshToken: this.createRefreshToken(user),
//     };
//   }
//   const createdUser = await this.userRepository.create({
//     firstName: facebookUser.firstName,
//     lastName: facebookUser.lastName,
//     email: facebookUser.email,
//     facebookId: facebookUser.facebookId,
//   });
//   return {
//     user: createdUser,
//     token: this.createNormalToken(createdUser),
//     refreshToken: this.createRefreshToken(createdUser),
//   };
// }

// async signUp(signUp: SignUpDto): Promise<{ user: UserDto; message: string }> {
//   const existingUser = await this.userRepository.findUserByPhoneNumber(
//     signUp.phoneNumber,
//   );
//   if (existingUser) {
//     throw new BadRequestException('phone number already exists');
//   }
//   const hashedPassword = await bcrypt.hash(
//     signUp.password,
//     AuthService.SALT_ROUNDS,
//   );

//   const createdUser = await this.userRepository.create({
//     ...signUp,
//     password: hashedPassword,
//   });

//   await this.otpService.sendOtp(signUp.phoneNumber);

//   return {
//     user: createdUser,
//     message: 'Please check your mobile for otp verification',
//   };
// }

// private verifyToken(token) {
//   try {
//     const decoded = this.jwtService.verify(
//       token,
//       this.config.get('JWT_SECRET'),
//     );
//     return decoded;
//   } catch (error) {
//     console.log({ error });

//     throw new UnprocessableEntityException('Wrong Token');
//   }
// }

// private createForgetPasswordOtp() {
//   let otp = Math.floor(Math.random() * 1000000);
//   return String(otp);
// }

// async signIn(signIn: SignInDto): Promise<AuthReturnDto> {
//   let theUser = await this.userRepository.findUserByEmail(signIn.email);

//   if (!theUser) {
//     throw new NotFoundException('User not found');
//   }
//   if (!theUser.phoneVerified) {
//     throw new BadRequestException('Phone Number not verified');
//   }
//   const { password, ...restProperties } = theUser;
//   const isPasswordValid = await bcrypt.compare(signIn.password, password);
//   if (!isPasswordValid) {
//     throw new UnauthorizedException('Invalid credentials');
//   }
//   let user = restProperties;
//   return {
//     user: user,
//     token: this.createNormalToken(user),
//     refreshToken: this.createRefreshToken(user),
//   };
// }

// async emailVerification(token) {
//   let decoded = this.verifyToken(token);
//   let userId = decoded.sub;
//   await this.userRepository.verifyEmail(userId);
//   let theUser = await this.userRepository.findById(userId);

//   return {
//     user: theUser,
//     token: this.createNormalToken(theUser),
//     refreshToken: this.createRefreshToken(theUser),
//   };
// }

// async forgetPassword(email) {
//   let theUser = await this.userRepository.findUserByEmail(email);
//   if (!theUser) {
//     throw new UnprocessableEntityException('User not found');
//   }
//   let theOtp = this.createForgetPasswordOtp();
//   await this.userRepository.saveForgetPasswordOtp(theOtp, theUser.id);

//   this.emailService.sendEmail(
//     theUser.email,
//     'Crespo Forget Password',
//     ForgetPasswordEmail(
//       `${theUser.firstName}` + ' ' + `${theUser.lastName}`,
//       theOtp,
//     ),
//   );
//   return true;
// }

// async validateForgetPasswordOtp(otp, email): Promise<{ token: string }> {
//   let theUser = await this.userRepository.findUserByEmail(email);
//   if (!theUser) {
//     throw new UnprocessableEntityException('User not found');
//   }
//   if (theUser.forgetPasswordOtp !== otp) {
//     throw new UnprocessableEntityException('Invalid otp');
//   }
//   return { token: this.createNormalToken(theUser) };
// }

// async changePassword(
//   password: string,
//   userId: number,
// ): Promise<AuthReturnDto> {
//   let theUser = await this.userRepository.findById(userId);
//   const hashedPassword = await bcrypt.hash(password, AuthService.SALT_ROUNDS);
//   await this.userRepository.changePassword(hashedPassword, theUser.id);
//   return {
//     user: theUser,
//     token: this.createNormalToken(theUser),
//     refreshToken: this.createRefreshToken(theUser),
//   };
// }

// async verifyAuthOTP(
//   otp: string,
//   mobileNumber: string,
// ): Promise<AuthReturnDto> {
//   const existingUser =
//     await this.userRepository.findUserByPhoneNumber(mobileNumber);
//   if (!existingUser) {
//     throw new UnprocessableEntityException(`phone number doesn't exists`);
//   }
//   await this.otpService.verifyOTP(existingUser.phoneNumber, otp);
//   const { password, ...restProperties } = existingUser;
//   let user = restProperties;
//   return {
//     user: user,
//     token: this.createNormalToken(user),
//     refreshToken: this.createRefreshToken(user),
//   };
// }
// async requestConnectPhoneNumberWithSocial(
//   connectSocial: ConnectSocial,
//   userId: number,
// ) {
//   let theUser = await this.userRepository.findById(userId);

// if (!connectSocial.facebookId && !connectSocial.googleId) {
//   throw new UnprocessableEntityException(
//     'Please provide a social id (facebookId or googleId)',
//   );
// }

// if (connectSocial.facebookId && connectSocial.googleId) {
//   throw new UnprocessableEntityException(
//     'Please provide either facebookId or googleId',
//   );
// }

//   await this.userRepository.updateSocialMedia(
//     connectSocial.firstName,
//     connectSocial.lastName,
//     connectSocial.email,
//     connectSocial.googleId,
//     connectSocial.facebookId,
//     theUser.id,
//   );

//   const { password, ...restProperties } = theUser;

//   return {
//     user: restProperties,
//     token: this.createNormalToken(restProperties),
//     refreshToken: this.createRefreshToken(restProperties),
//   };
// }
