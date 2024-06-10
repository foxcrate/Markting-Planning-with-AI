import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { GoogleReturnDataSerializer } from './serializers/google-return-data.serializer';
import { FacebookReturnDataSerializer } from './serializers/facebook-return-data.serializer';
import { SocialSignDto } from './dtos/social-sign.dto';
import { SocialSignUpDto } from './dtos/social-signup.dto';
import { SocialSignInDto } from './dtos/social-signin.dto';
import { MobileSignUpDto } from './dtos/mobile-signup.dto';
import { MobileSignInDto } from './dtos/mobile-signin.dto';
import { VerifyConnectSocialOtpDto } from './dtos/verify-connect-social-otp.dto';
import { PhoneNumberDto } from './dtos/phone-number.dto';
import { SendEmailDto } from './dtos/send-email-otp.dto';
import { AuthGuard } from 'src/gurads/auth.guard';
import { VerifyEmailOtpDto } from './dtos/verify-email-otp.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SignupReturnDto } from './dtos/signup-return.dto';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { SignInReturnDto } from './dtos/signin-return.dto';
import { FacebookDataReturnDto } from './dtos/facebook-data-return.dto';
import { GoogleDataReturnDto } from './dtos/google-data-return.dto';
import { AuthReturnDto } from './dtos/auth-return.dto';
import { RefreshTokenReturnDto } from './dtos/refresh-token-return.dto';
import { SendEmailReturnDto } from './dtos/send-email-return-otp.dto';
import { UserDto } from 'src/user/dtos/user.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /////////////////// Mobile Auth //////////////////////////

  @ApiBody({
    type: MobileSignUpDto,
  })
  @ApiCreatedResponse({
    type: SignupReturnDto,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @Post('mobile-sign-up')
  async mobileSignUp(@Body() signUpDto: MobileSignUpDto) {
    return this.authService.mobileSignUp(signUpDto);
  }

  @ApiBody({
    type: MobileSignInDto,
  })
  @ApiCreatedResponse({
    type: SignInReturnDto,
    description: 'OTP will be sent to the phone number',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @Post('mobile-sign-in')
  async mobileSignIn(@Body() signInDto: MobileSignInDto) {
    return this.authService.mobileSignIn(signInDto);
  }

  //////////////////////Social Auth ///////////////////////////

  @ApiBody({
    type: SocialSignDto,
  })
  @ApiCreatedResponse({
    type: GoogleDataReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @Post('google-data')
  async googleRedirect(@Body() socialSign: SocialSignDto) {
    let userData = await this.authService.getGoogleUserData(
      socialSign.accessToken,
    );

    return GoogleReturnDataSerializer.serialize(userData);
  }

  @ApiBody({
    type: SocialSignDto,
  })
  @ApiCreatedResponse({
    type: FacebookDataReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @Post('facebook-data')
  async facebookRedirect(@Body() socialSign: SocialSignDto) {
    let userData = await this.authService.getFacebookUserData(
      socialSign.accessToken,
    );

    return FacebookReturnDataSerializer.serialize(userData);
  }

  @ApiBody({
    type: SocialSignUpDto,
  })
  @ApiCreatedResponse({
    type: SignupReturnDto,
    description: 'OTP will be sent to the phone number',
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @Post('social-sign-up')
  async socialSignUp(@Body() socialSignUp: SocialSignUpDto) {
    return await this.authService.socialSignUp(socialSignUp);
  }

  @ApiBody({
    type: SocialSignInDto,
    description: 'googleId or facebookId is required',
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @Post('social-sign-in')
  async socialSignIn(@Body() socialSignIn: SocialSignInDto) {
    return await this.authService.socialSignIn(socialSignIn);
  }

  @ApiBody({
    type: PhoneNumberDto,
  })
  @ApiCreatedResponse({
    type: SignInReturnDto,
    description: 'OTP will be sent to the phone number',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @Post('request/connect-phone-social')
  async connectPhoneSocial(@Body() { phoneNumber }: PhoneNumberDto) {
    return await this.authService.requestConnectPhoneNumberWithSocial(
      phoneNumber,
    );
  }

  @ApiBody({
    type: VerifyConnectSocialOtpDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @Post('verify/connect-social-otp')
  async verifyConnectSocialOtp1(
    @Body() verifyConnectSocialOtp: VerifyConnectSocialOtpDto,
  ) {
    return await this.authService.verifyConnectSocialOTP(
      verifyConnectSocialOtp,
    );
  }

  ///////////////////////////////

  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiCreatedResponse({
    type: RefreshTokenReturnDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }

  @ApiBody({
    type: VerifyOtpDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @Post('verify/signup-otp')
  async verifySignupOtp1(@Body() verifyOtpData: VerifyOtpDto) {
    return await this.authService.verifySignupOTP(
      verifyOtpData.otp,
      verifyOtpData.mobileNumber,
    );
  }

  @ApiBody({
    type: VerifyOtpDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @Post('verify/signin-otp')
  async verifySigninOtp1(@Body() verifyOtpData: VerifyOtpDto) {
    return await this.authService.verifySigninOTP(
      verifyOtpData.otp,
      verifyOtpData.mobileNumber,
    );
  }

  ////////////////////////

  @ApiBody({
    type: SendEmailDto,
  })
  @ApiCreatedResponse({
    type: SendEmailReturnDto,
    description: 'Email sent successfully',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @Post('email-otp')
  @UseGuards(AuthGuard)
  async sendEmailOtp(@Body() sendEmailDto: SendEmailDto) {
    return await this.authService.sendEmailOtp(sendEmailDto.email);
  }

  @ApiBody({
    type: VerifyEmailOtpDto,
  })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @Post('verify/email-otp')
  @UseGuards(AuthGuard)
  async verifyEmailOtp(
    @Body() verifyEmailOtpDto: VerifyEmailOtpDto,
    @UserId() userId: number,
  ) {
    return await this.authService.verifyEmailOTP(
      verifyEmailOtpDto.email,
      verifyEmailOtpDto.otp,
      userId,
    );
  }
}
