import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { GoogleSignInUpDto } from './dtos/sign-up-with-google.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';

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
}
