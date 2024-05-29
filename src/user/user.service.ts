import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { UserDto } from './dtos/user.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceService: WorkspaceService,
  ) {}
  async update(UpdateProfileBody: UpdateProfileDto, userId): Promise<UserDto> {
    return await this.userRepository.update(UpdateProfileBody, userId);
  }

  async userOnboarded(userId: number): Promise<boolean> {
    return await this.workspaceService.userHasWorkspace(userId);
  }
}
