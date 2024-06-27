import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/gurads/auth.guard';
import { CreateAiTacticDto } from './dtos/create-ai-tactic.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { OpenAiService } from './open-ai.service';
import { AiCreatedTacticDto } from './dtos/ai-created-tactic.dto';
import { ErrorResponseDto } from 'src/dtos/error-response.dto';
import { AiChatRequestDto } from './dtos/ai-chat-request.dto';
import { AiChatResponseDto } from './dtos/ai-chat-response.dto';

@Controller({ path: 'ai', version: '1' })
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @ApiBody({ type: CreateAiTacticDto })
  @ApiCreatedResponse({
    type: AiCreatedTacticDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Ai: Create Tactic')
  @Post('create-tactic')
  @UseGuards(AuthGuard)
  async aiCreateTactic(
    @Body() body: CreateAiTacticDto,
    @UserId() userId: number,
  ) {
    return this.openAiService.aiCreateTactic(body, userId);
  }

  @ApiBody({ type: AiChatRequestDto })
  @ApiCreatedResponse({
    type: AiChatResponseDto,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @ApiTags('Ai: Chat')
  @Post('chat')
  @UseGuards(AuthGuard)
  async aiChat(@Body() body: AiChatRequestDto, @UserId() userId: number) {
    return this.openAiService.aiChat(body, userId);
  }
}
