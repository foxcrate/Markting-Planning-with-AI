import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageDto } from './dtos/send-message.dto';
import { MessageService } from './message.service';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(@Body() message: SendMessageDto) {
    return this.messageService.sendMessage(message.content);
  }
}
