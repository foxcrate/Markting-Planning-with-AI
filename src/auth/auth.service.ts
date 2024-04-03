import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UserDto } from '../user/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from 'src/auth/google-auth.service';
import { UserModel } from '../user/user.model';
import { FacebookAuthService } from './facebook-auth.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import VerificationEmail from 'src/email/templates/verification-email.template';
import ForgetPasswordEmail from 'src/email/templates/forget-password-otp.template';

@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userModel: UserModel,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private config: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {}

  private createUserToken(user: UserDto) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async signUp(signUp: SignUpDto): Promise<{ user: UserDto; message: string }> {
    const existingUser = await this.userModel.findUserByEmail(signUp.email);
    if (existingUser) {
      throw new UnprocessableEntityException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(
      signUp.password,
      AuthService.SALT_ROUNDS,
    );

    const createdUser = await this.userModel.create({
      ...signUp,
      password: hashedPassword,
    });

    //create jwt token contain user id
    let emailVerificationToken = this.createUserToken(createdUser);

    console.log({ emailVerificationToken });

    this.emailService.sendEmail(
      createdUser.email,
      'Crespo Email Verification',
      VerificationEmail(
        `${createdUser.firstName}` + ' ' + `${createdUser.lastName}`,
        emailVerificationToken,
      ),
    );

    return {
      user: createdUser,
      message: 'Please check your email for verification',
    };
  }

  async googleSignInUp(
    token: string,
  ): Promise<{ user: UserDto; token: string }> {
    const googleUser = await this.googleAuthService.verifyToken(token);
    const existingUsers = await this.userModel.findUsersByEmailOrGoogleId(
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
      return { user, token: this.createUserToken(user) };
    }
    const createdUser = await this.userModel.create({
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      email: googleUser.email,
      googleId: googleUser.googleId,
    });
    return { user: createdUser, token: this.createUserToken(createdUser) };
  }

  async facebookSignInUp(
    token: string,
  ): Promise<{ user: UserDto; token: string }> {
    const facebookUser = await this.facebookAuthService.verifyToken(token);
    const existingUsers = await this.userModel.findUsersByEmailOrFacebookId(
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
      return { user, token: this.createUserToken(user) };
    }
    const createdUser = await this.userModel.create({
      firstName: facebookUser.firstName,
      lastName: facebookUser.lastName,
      email: facebookUser.email,
      facebookId: facebookUser.facebookId,
    });
    return { user: createdUser, token: this.createUserToken(createdUser) };
  }

  async signIn(signIn: SignInDto): Promise<{ user: UserDto; token: string }> {
    let theUser = await this.userModel.findUserByEmail(signIn.email);

    if (!theUser) {
      throw new UnprocessableEntityException('User not found');
    }
    if (!theUser.emailVerified) {
      throw new UnprocessableEntityException('Email not verified');
    }
    const { password, ...restProperties } = theUser;
    const isPasswordValid = await bcrypt.compare(signIn.password, password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    let user = restProperties;
    return { user, token: this.createUserToken(restProperties) };
  }

  async emailVerification(token) {
    let decoded = this.verifyToken(token);
    let userId = decoded.sub;
    await this.userModel.verifyEmail(userId);
    let theUser = await this.userModel.findById(userId);

    return { user: theUser, token: this.createUserToken(theUser) };
  }

  async forgetPassword(email) {
    let theUser = await this.userModel.findUserByEmail(email);
    if (!theUser) {
      throw new UnprocessableEntityException('User not found');
    }
    let theOtp = this.createForgetPasswordOtp();
    await this.userModel.saveForgetPasswordOtp(theOtp, theUser.id);

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

  async validateForgetPasswordOtp(otp, email) {
    let theUser = await this.userModel.findUserByEmail(email);
    if (!theUser) {
      throw new UnprocessableEntityException('User not found');
    }
    if (theUser.forgetPasswordOtp !== otp) {
      throw new UnprocessableEntityException('Invalid otp');
    }
    return { token: this.createUserToken(theUser) };
  }

  async changePassword(password: string, userId: number) {
    const hashedPassword = await bcrypt.hash(password, AuthService.SALT_ROUNDS);
    await this.userModel.changePassword(hashedPassword, userId);
    let theUser = await this.userModel.findById(userId);
    return { user: theUser, token: this.createUserToken(theUser) };
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
}
