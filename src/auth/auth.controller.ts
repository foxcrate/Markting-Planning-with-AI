import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { GoogleSignInUpDto } from './dtos/sign-up-with-google.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { VerifyForgetPasswordOtpDto } from './dtos/verify-forget-password-otp.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('google')
  async signInUpWithGoogle(@Body() googleSignInUp: GoogleSignInUpDto) {
    return this.authService.googleSignInUp(googleSignInUp.token);
  }

  @Post('facebook')
  async signInUpWithFacebook(@Body() googleSignInUp: GoogleSignInUpDto) {
    return this.authService.facebookSignInUp(googleSignInUp.token);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('email-verification')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.emailVerification(verifyEmailDto.token);
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @Post('validate-forget-password-otp')
  async validateForgetPasswordOtp(
    @Body() verifyForgetPasswordOtpDto: VerifyForgetPasswordOtpDto,
  ) {
    return this.authService.validateForgetPasswordOtp(
      verifyForgetPasswordOtpDto.otp,
      verifyForgetPasswordOtpDto.email,
    );
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserId() userId: number,
  ) {
    return this.authService.changePassword(changePasswordDto.password, userId);
  }
}
