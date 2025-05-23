import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { GoogleReturnDataSerializer } from './serializers/google-return-data.serializer';
import { FacebookReturnDataSerializer } from './serializers/facebook-return-data.serializer';
import { SocialSignDto } from './dtos/social-sign.dto';
import { SocialSignUpDto } from './dtos/social-signup.dto';
import { SocialSignInDto } from './dtos/social-signin.dto';
import { MobileSignUpDto } from './dtos/mobile-signup.dto';
import { MobileSignInDto } from './dtos/mobile-signin.dto';
import { ConnectSocialDto } from './dtos/connect-social.dto';
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
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { FacebookDataReturnDto } from './dtos/facebook-data-return.dto';
import { GoogleDataReturnDto } from './dtos/google-data-return.dto';
import { AuthReturnDto } from './dtos/auth-return.dto';
import { RefreshTokenReturnDto } from './dtos/refresh-token-return.dto';
import { SendEmailReturnDto } from './dtos/send-email-return-otp.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { UpdateSocialDto } from './dtos/update-social.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /////////////////// Mobile Auth //////////////////////////

  @ApiBody({
    type: MobileSignUpDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @ApiTags('Auth: Mobile Signup')
  @Post('mobile-sign-up')
  async mobileSignUp(@Body() signUpDto: MobileSignUpDto) {
    return this.authService.mobileSignUp(signUpDto);
  }

  @ApiBody({
    type: MobileSignInDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiTags('Auth: Mobile Signin')
  @Post('mobile-sign-in')
  async mobileSignIn(@Body() signInDto: MobileSignInDto) {
    return this.authService.mobileSignIn(signInDto);
  }

  @ApiBody({
    type: PhoneNumberDto,
  })
  @ApiCreatedResponse({
    type: Boolean,
    description: 'return true if phone number is saved',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiTags('Auth: Check Saved Phone Number')
  @Post('check/saved-phone')
  async checkSavedPhone(@Body() body: PhoneNumberDto) {
    return this.authService.checkSavedPhone(body.phoneNumber);
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
  @ApiTags('Auth: Get Google Data')
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
  @ApiTags('Auth: Get Facebook Data')
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
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiTags('Auth: Social Signup')
  @Post('social-sign-up')
  async socialSignUp(@Body() socialSignUp: SocialSignUpDto) {
    return await this.authService.socialSignUp(socialSignUp);
  }

  @ApiBody({
    type: UpdateSocialDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Auth: Update Social')
  @Post('update-social')
  @UseGuards(AuthGuard)
  async updateSocial(
    @Body() reqBody: UpdateSocialDto,
    @UserId() userId: number,
  ) {
    return await this.authService.updateSocial(reqBody, userId);
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
  @ApiTags('Auth:Social Signin')
  @Post('social-sign-in')
  async socialSignIn(@Body() socialSignIn: SocialSignInDto) {
    return await this.authService.socialSignIn(socialSignIn);
  }

  @ApiBody({
    type: ConnectSocialDto,
  })
  @ApiCreatedResponse({
    type: AuthReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiTags('Auth: Connect Social')
  @Post('connect-social')
  async connectSocial(@Body() connectSocial: ConnectSocialDto) {
    return await this.authService.connectSocial(connectSocial);
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
  @ApiTags('Auth: Refresh Token')
  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
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
  @ApiTags('Auth: Send Email OTP')
  @Post('email-otp')
  @UseGuards(AuthGuard)
  async sendEmailOtp(@Body() sendEmailDto: SendEmailDto) {
    return await this.authService.sendEmailOtp(sendEmailDto.contactEmail);
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
  @ApiTags('Auth: Email OTP Verification')
  @Post('verify/email-otp')
  @UseGuards(AuthGuard)
  async verifyEmailOtp(
    @Body() verifyEmailOtpDto: VerifyEmailOtpDto,
    @UserId() userId: number,
  ) {
    return await this.authService.verifyEmailOTP(
      verifyEmailOtpDto.contactEmail,
      verifyEmailOtpDto.otp,
      userId,
    );
  }
}
