import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse()
  @Get()
  getHello(@Req() req): { message: string } {
    // console.log(req);

    return this.appService.getHello();
  }

  @Get('test-firebase')
  async testFirebase() {
    await this.appService.testFirebase();
  }
}
