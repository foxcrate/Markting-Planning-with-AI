import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';
import { ChangePhoneNumberDto } from 'src/user/dtos/change-phone-number.dto';
import { ChangeEmailDto } from './dtos/change-email-dto';
import { VerifyChangePhoneNumberDto } from './dtos/verify-change-phone-number-dto';
import { VerifyChangeEmailDto } from './dtos/verify-change-email.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { UserDto } from './dtos/user.dto';
import { MessageReturnDto } from '../dtos/message-return.dto';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        profilePicture: {
          type: 'string',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Update')
  @Put()
  @UseGuards(AuthGuard)
  async update(
    @Body() UpdateProfileBody: UpdateProfileDto,
    @UserId() userId: number,
  ) {
    return this.userService.update(UpdateProfileBody, userId);
  }

  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Get')
  @Get()
  @UseGuards(AuthGuard)
  async getUserData(@UserId() userId: number) {
    return this.userService.getUserData(userId);
  }

  @ApiBody({ type: ChangePhoneNumberDto })
  @ApiCreatedResponse({
    type: MessageReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Change Phone Number')
  @Post('change/phone-number')
  @UseGuards(AuthGuard)
  async changePhoneNumber(
    @Body() changePhoneNumberBody: ChangePhoneNumberDto,
    @UserId() userId: number,
  ) {
    return this.userService.changePhoneNumber(
      changePhoneNumberBody.phoneNumber,
      changePhoneNumberBody.newPhoneNumber,
      userId,
    );
  }

  // @ApiBody({ type: VerifyChangePhoneNumberDto })
  // @ApiCreatedResponse({
  //   type: MessageReturnDto,
  // })
  // @ApiNotFoundResponse({
  //   type: ErrorResponseDto,
  // })
  // @ApiBearerAuth()
  // @ApiTags('User: Change phone number verification')
  // @Post('verify/change-phone-number')
  // @UseGuards(AuthGuard)
  // async verifyChangePhoneNumber(
  //   @Body() body: VerifyChangePhoneNumberDto,
  //   @UserId() userId,
  // ) {
  //   return await this.userService.verifyChangePhoneNumberOTP(
  //     body.phoneNumber,
  //     body.otp,
  //     userId,
  //   );
  // }

  @ApiBody({ type: ChangeEmailDto })
  @ApiCreatedResponse({
    type: MessageReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Change Email')
  @Post('change/email')
  @UseGuards(AuthGuard)
  async changeEmail(@Body() changeEmailBody: ChangeEmailDto) {
    return this.userService.changeEmail(changeEmailBody.email);
  }

  @ApiBody({ type: VerifyChangeEmailDto })
  @ApiCreatedResponse({
    type: MessageReturnDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('User: Change Email Verification')
  @Post('verify/change-email')
  @UseGuards(AuthGuard)
  async verifyChangeEmail(
    @Body() body: VerifyChangeEmailDto,
    @UserId() userId,
  ) {
    return await this.userService.verifyChangeEmailOTP(
      body.email,
      body.otp,
      userId,
    );
  }
}
