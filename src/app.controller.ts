import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageReturnDto } from './dtos/message-return.dto';
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
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Get('test-firebase')
  test() {
    return this.appService.testFirebase();
  }
}
