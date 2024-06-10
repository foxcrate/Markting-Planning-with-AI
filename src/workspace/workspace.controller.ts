import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { WorkspaceService } from './workspace.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { WorkspaceUpdateDto } from './dtos/workspace-update.dto';
import { ParamsIdDto } from './dtos/params-id.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { WorkspaceReturnDto } from './dtos/workspace-return.dto';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';

@Controller({ path: 'workspace', version: '1' })
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiParam({ name: 'id' })
  @ApiBody({ type: WorkspaceUpdateDto })
  @ApiCreatedResponse({
    type: WorkspaceReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Workspace: Update')
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

  @ApiParam({ name: 'id' })
  @ApiBody({ type: WorkspaceUpdateDto })
  @ApiCreatedResponse({
    type: WorkspaceReturnDto,
  })
  @ApiUnprocessableEntityResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Workspace: Confirm')
  @Put('/confirm/:id')
  @UseGuards(AuthGuard)
  async confirm(
    @Body() workspaceUpdateBody: WorkspaceUpdateDto,
    @Param() paramsIdDto: ParamsIdDto,
    @UserId() userId: number,
  ) {
    return await this.workspaceService.confirm(
      paramsIdDto.id,
      workspaceUpdateBody,
      userId,
    );
  }
}
