import { SenderRole } from 'src/enums/sender-role.enum';

export class MessageReturnDto {
  id: number;
  content: string;
  threadId: number;
  senderRole: SenderRole;
  templateFlowStepNumber: number;
}
