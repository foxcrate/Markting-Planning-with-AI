import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UserDto } from '../user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from 'src/auth/google-auth.service';
import { UserRepository } from '../user/user.repository';
import { FacebookAuthService } from './facebook-auth.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import ForgetPasswordEmail from 'src/email/templates/forget-password-otp.template';
import { OtpService } from 'src/otp/otp.service';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { AuthReturnDto } from './dtos/auth-return.dto';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private config: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {}

  private createNormalToken(user: UserDto) {
    const payload = { sub: user.id, tokenType: 'normal' };
    return this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
  }

  private createRefreshToken(user: UserDto) {
    const payload = { sub: user.id, tokenType: 'refresh' };
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  }

  private verifyToken(token) {
    try {
      const decoded = this.jwtService.verify(
        token,
        this.config.get('JWT_SECRET'),
      );
      return decoded;
    } catch (error) {
      console.log({ error });

      throw new UnprocessableEntityException('Wrong Token');
    }
  }

  private createForgetPasswordOtp() {
    let otp = Math.floor(Math.random() * 1000000);
    return String(otp);
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

  async signUp(signUp: SignUpDto): Promise<{ user: UserDto; message: string }> {
    const existingUser = await this.userRepository.findUserByPhoneNumber(
      signUp.phoneNumber,
    );
    if (existingUser) {
      throw new UnprocessableEntityException('phone number already exists');
    }
    const hashedPassword = await bcrypt.hash(
      signUp.password,
      AuthService.SALT_ROUNDS,
    );

    const createdUser = await this.userRepository.create({
      ...signUp,
      password: hashedPassword,
    });

    await this.otpService.sendOtp(signUp.phoneNumber);

    return {
      user: createdUser,
      message: 'Please check your mobile for otp verification',
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
    await this.otpService.verifyOTP(existingUser.phoneNumber, otp);
    await this.userRepository.verifyPhoneNumber(existingUser.id);
    const { password, ...restProperties } = existingUser;
    let user = restProperties;
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  async googleSignInUp(token: string): Promise<AuthReturnDto> {
    const googleUser = await this.googleAuthService.verifyToken(token);
    const existingUsers = await this.userRepository.findUsersByEmailOrGoogleId(
      googleUser.email,
      googleUser.googleId,
    );
    if (Array.isArray(existingUsers) && existingUsers.length) {
      if (
        existingUsers.length > 1 ||
        existingUsers[0].email === googleUser.email
      ) {
        throw new UnprocessableEntityException(
          'Found matching users with the same email',
        );
      }
      const [user] = existingUsers;
      return {
        user: user,
        token: this.createNormalToken(user),
        refreshToken: this.createRefreshToken(user),
      };
    }
    const createdUser = await this.userRepository.create({
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      email: googleUser.email,
      googleId: googleUser.googleId,
    });
    return {
      user: createdUser,
      token: this.createNormalToken(createdUser),
      refreshToken: this.createRefreshToken(createdUser),
    };
  }

  async facebookSignInUp(token: string): Promise<AuthReturnDto> {
    const facebookUser = await this.facebookAuthService.verifyToken(token);
    const existingUsers =
      await this.userRepository.findUsersByEmailOrFacebookId(
        facebookUser.email,
        facebookUser.facebookId,
      );
    if (Array.isArray(existingUsers) && existingUsers.length) {
      if (
        existingUsers.length > 1 ||
        existingUsers[0].email === facebookUser.email
      ) {
        throw new UnprocessableEntityException(
          'Found matching users with the same email',
        );
      }
      const [user] = existingUsers;
      return {
        user: user,
        token: this.createNormalToken(user),
        refreshToken: this.createRefreshToken(user),
      };
    }
    const createdUser = await this.userRepository.create({
      firstName: facebookUser.firstName,
      lastName: facebookUser.lastName,
      email: facebookUser.email,
      facebookId: facebookUser.facebookId,
    });
    return {
      user: createdUser,
      token: this.createNormalToken(createdUser),
      refreshToken: this.createRefreshToken(createdUser),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthReturnDto> {
    let payload: any = this.verifyRefreshToken(refreshToken);

    if (payload.sub == null) {
      throw new UnauthorizedException('Wrong Credentials');
    }
    if (payload.tokenType != 'refresh') {
      throw new UnauthorizedException('Wrong Credentials');
    }

    let tokenPayload = {
      sub: payload.sub,
      tokenType: 'normal',
    };

    let refreshTokenPayload = {
      sub: payload.sub,
      tokenType: 'refresh',
    };
    const user = await this.userRepository.findById(payload.sub);

    return {
      user: user,
      token: this.jwtService.sign(tokenPayload, {
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '30d',
      }),
    };
  }

  async signIn(signIn: SignInDto): Promise<AuthReturnDto> {
    let theUser = await this.userRepository.findUserByEmail(signIn.email);

    if (!theUser) {
      throw new UnprocessableEntityException('User not found');
    }
    if (!theUser.phoneVerified) {
      throw new UnprocessableEntityException('Phone Number not verified');
    }
    const { password, ...restProperties } = theUser;
    const isPasswordValid = await bcrypt.compare(signIn.password, password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    let user = restProperties;
    return {
      user: user,
      token: this.createNormalToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  async emailVerification(token) {
    let decoded = this.verifyToken(token);
    let userId = decoded.sub;
    await this.userRepository.verifyEmail(userId);
    let theUser = await this.userRepository.findById(userId);

    return {
      user: theUser,
      token: this.createNormalToken(theUser),
      refreshToken: this.createRefreshToken(theUser),
    };
  }

  async forgetPassword(email) {
    let theUser = await this.userRepository.findUserByEmail(email);
    if (!theUser) {
      throw new UnprocessableEntityException('User not found');
    }
    let theOtp = this.createForgetPasswordOtp();
    await this.userRepository.saveForgetPasswordOtp(theOtp, theUser.id);

    this.emailService.sendEmail(
      theUser.email,
      'Crespo Forget Password',
      ForgetPasswordEmail(
        `${theUser.firstName}` + ' ' + `${theUser.lastName}`,
        theOtp,
      ),
    );
    return true;
  }

  async validateForgetPasswordOtp(otp, email): Promise<{ token: string }> {
    let theUser = await this.userRepository.findUserByEmail(email);
    if (!theUser) {
      throw new UnprocessableEntityException('User not found');
    }
    if (theUser.forgetPasswordOtp !== otp) {
      throw new UnprocessableEntityException('Invalid otp');
    }
    return { token: this.createNormalToken(theUser) };
  }

  async changePassword(
    password: string,
    userId: number,
  ): Promise<AuthReturnDto> {
    let theUser = await this.userRepository.findById(userId);
    const hashedPassword = await bcrypt.hash(password, AuthService.SALT_ROUNDS);
    await this.userRepository.changePassword(hashedPassword, theUser.id);
    return {
      user: theUser,
      token: this.createNormalToken(theUser),
      refreshToken: this.createRefreshToken(theUser),
    };
  }
}
