import { ApiProperty } from '@nestjs/swagger';

export class AiChatResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  threadId: number;
}
