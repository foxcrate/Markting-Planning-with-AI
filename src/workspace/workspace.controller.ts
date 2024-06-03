import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { WorkspaceService } from './workspace.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { WorkspaceUpdateDto } from './dtos/workspace-update.dto';
import { ParamsIdDto } from './dtos/params-id.dto';

@Controller({ path: 'workspace', version: '1' })
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Body() workspaceUpdateDto: WorkspaceUpdateDto,
    @Param() paramsIdDto: ParamsIdDto,
    @UserId() userId: number,
  ) {
    return await this.workspaceService.update(
      paramsIdDto.id,
      workspaceUpdateDto,
      userId,
    );
  }

  @Put('/confirm/:id')
  @UseGuards(AuthGuard)
  async confirm(@Param() paramsIdDto: ParamsIdDto, @UserId() userId: number) {
    return await this.workspaceService.confirm(paramsIdDto.id, userId);
  }
}
