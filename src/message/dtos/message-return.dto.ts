import { ApiProperty } from '@nestjs/swagger';
import { SenderRoleEnum } from 'src/enums/sender-role.enum';

export class MessageReturnDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  threadId: number;
  @ApiProperty({ enum: SenderRoleEnum })
  senderRole: SenderRoleEnum;
}
