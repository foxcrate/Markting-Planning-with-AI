import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { ChangePhoneNumberDto } from 'src/user/dtos/change-phone-number.dto';
import { ChangeEmailDto } from './dtos/change-email-dto';
import { VerifyChangePhoneNumberDto } from './dtos/verify-change-phone-number-dto';
import { VerifyChangeEmailDto } from './dtos/verify-change-email.dto';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @UseGuards(AuthGuard)
  async update(
    @Body() UpdateProfileBody: UpdateProfileDto,
    @UserId() userId: number,
  ) {
    return this.userService.update(UpdateProfileBody, userId);
  }

  @Post('change/phone-number')
  @UseGuards(AuthGuard)
  async changePhoneNumber(
    @Body() changePhoneNumberBody: ChangePhoneNumberDto,
  ) {
    return this.userService.changePhoneNumber(changePhoneNumberBody.phoneNumber);
  }

  @Post('verify/change-phone-number')
  @UseGuards(AuthGuard)
  async verifyChangePhoneNumber(@Body() body: VerifyChangePhoneNumberDto,@UserId() userId) {
    return await this.userService.verifyChangePhoneNumberOTP(
      body.phoneNumber,
      body.otp,
      userId
    );
  }

  @Post('change/email')
  @UseGuards(AuthGuard)
  async changeEmail(
    @Body() changeEmailBody: ChangeEmailDto,
  ) {
    return this.userService.changeEmail(changeEmailBody.email);
  }

  @Post('verify/change-email')
  @UseGuards(AuthGuard)
  async verifyChangeEmail(@Body() body: VerifyChangeEmailDto,@UserId() userId) {
    return await this.userService.verifyChangeEmailOTP(
      body.email,
      body.otp,
      userId
    );
  }
}
