import { ApiProperty } from '@nestjs/swagger';

export class NotEndedThreadAiResponseDto {
  @ApiProperty()
  assistantMessage: string;

  @ApiProperty()
  threadEnd: boolean;
}
