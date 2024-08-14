import { ApiProperty } from '@nestjs/swagger';
import { DocumentRequiredDataDto } from './document-required-data.dto';

export class DocumentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
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
