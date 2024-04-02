import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SendMessageDto } from './dtos/send-message.dto';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller({ path: 'message', version: '1' })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  @UseGuards(AuthGuard)
  async sendMessage(@Body() message: SendMessageDto, @UserId() userId: number) {
    return this.messageService.sendMessage(
      message.content,
      message.threadId,
      userId,
    );
  }
}
