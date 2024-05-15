import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { WorkspaceRepository } from './workspace/workspace.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  async test(@Body() body) {
    let obj = {
      name: body.name,
      goal: body.goal,
      budget: body.budget,
      targetGroup: body.targetGroup,
      marketingLevel: body.marketingLevel,
      userId: body.userId,
    };
    return await this.workspaceRepository.findUserWorkspaces(body.userId);
  }
}
