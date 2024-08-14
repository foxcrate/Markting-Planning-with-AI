import { ApiProperty } from '@nestjs/swagger';
import { DocumentRequiredDataDto } from './document-required-data.dto';

export class DocumentReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: DocumentRequiredDataDto, isArray: true })
  requiredData: DocumentRequiredDataDto[];

  @ApiProperty()
  confirmedAnswer: string;

  @ApiProperty()
  aiResponse: string;

  @ApiProperty()
  templateId: number;

  @ApiProperty()
  userId: number;
}
