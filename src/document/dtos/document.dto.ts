import { ApiProperty } from '@nestjs/swagger';

export class DocumentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  requiredData: string;

  @ApiProperty()
  aiResponse: string;

  @ApiProperty()
  templateId: number;

  @ApiProperty()
  userId: number;
}
