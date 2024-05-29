import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { AuthGuard } from 'src/gurads/auth.guard';

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
}
