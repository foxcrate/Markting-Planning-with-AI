import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { GoogleReturnDataSerializer } from './serializers/google-return-data.serializer';
import { FacebookReturnDataSerializer } from './serializers/facebook-return-data.serializer';
import { SocialSignDto } from './dtos/social-sign.dto';
import { SocialSignUp } from './dtos/social-signup.dto';
import { ConnectSocial } from './dtos/connect-social.dto';
import { SocialSignIn } from './dtos/social_signin.dto';
import { MobileSignUpDto } from './dtos/mobile-signup.dto';
import { MobileSignInDto } from './dtos/mobile-signin.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /////////////////// Mobile Auth //////////////////////////

  @Post('mobile-sign-up')
  async mobileSignUp(@Body() signUpDto: MobileSignUpDto) {
    return this.authService.mobileSignUp(signUpDto);
  }

  @Post('mobile-sign-in')
  async mobileSignIn(@Body() signInDto: MobileSignInDto) {
    return this.authService.mobileSignIn(signInDto);
  }

  //////////////////////Social Auth ///////////////////////////

  @Post('google-data')
  async googleRedirect(@Body() socialSign: SocialSignDto) {
    let userData = await this.authService.getGoogleUserData(
      socialSign.accessToken,
    );

    return GoogleReturnDataSerializer.serialize(userData);
  }

  @Post('facebook-data')
  async facebookRedirect(@Body() socialSign: SocialSignDto) {
    let userData = await this.authService.getFacebookUserData(
      socialSign.accessToken,
    );

    return FacebookReturnDataSerializer.serialize(userData);
  }

  @Post('social-sign-up')
  async socialSignUp(@Body() socialSignUp: SocialSignUp) {
    return await this.authService.socialSignUp(socialSignUp);
  }

  @Post('connect-phone-social')
  @UseGuards(AuthGuard)
  async connectPhoneSocial(
    @Body() connectSocial: ConnectSocial,
    @UserId() userId: number,
  ) {
    return await this.authService.connectSocialWithPhoneNumber(
      connectSocial,
      userId,
    );
  }

  @Post('social-sign-in')
  async socialSignIn(@Body() socialSignIn: SocialSignIn) {
    return await this.authService.socialSignIn(socialSignIn);
  }

  ///////////////////////////////

  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('verify-auth-otp')
  async verifySigninOtp1(@Body() verifyOtpData: VerifyOtpDto) {
    return await this.authService.verifyAuthOTP(
      verifyOtpData.otp,
      verifyOtpData.mobileNumber,
    );
  }
}

// @Post('verify-signup-otp')
// async verifySignupOtp1(@Body() verifyOtpData: VerifyOtpDto) {
//   return await this.authService.verifyAuthOTP(
//     verifyOtpData.otp,
//     verifyOtpData.mobileNumber,
//   );
// }

// @Post('google')
// async signInUpWithGoogle(@Body() googleSignInUp: GoogleSignInUpDto) {
//   return this.authService.googleSignInUp(googleSignInUp.token);
// }

// @Post('facebook')
// async signInUpWithFacebook(@Body() googleSignInUp: GoogleSignInUpDto) {
//   return this.authService.facebookSignInUp(googleSignInUp.token);
// }

// @Post('sign-up')
// async signUp(@Body() signUpDto: SignUpDto) {
//   return this.authService.signUp(signUpDto);
// }

// @Post('email-verification')
// async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
//   return this.authService.emailVerification(verifyEmailDto.token);
// }

// @Post('forget-password')
// async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
//   return this.authService.forgetPassword(forgetPasswordDto.email);
// }

// @Post('validate-forget-password-otp')
// async validateForgetPasswordOtp(
//   @Body() verifyForgetPasswordOtpDto: VerifyForgetPasswordOtpDto,
// ) {
//   return this.authService.validateForgetPasswordOtp(
//     verifyForgetPasswordOtpDto.otp,
//     verifyForgetPasswordOtpDto.email,
//   );
// }

// @Post('change-password')
// @UseGuards(AuthGuard)
// async changePassword(
//   @Body() changePasswordDto: ChangePasswordDto,
//   @UserId() userId: number,
// ) {
//   return this.authService.changePassword(changePasswordDto.password, userId);
// }

// @Post('sign-in')
// async signIn(@Body() signInDto: SignInDto) {
//   return this.authService.signIn(signInDto);
// }
