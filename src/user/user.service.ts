import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async update(UpdateProfileBody: UpdateProfileDto, userId): Promise<UserDto> {
    return await this.userRepository.update(UpdateProfileBody, userId);
  }
}
