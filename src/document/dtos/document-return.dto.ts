import { ApiProperty } from '@nestjs/swagger';

export class DocumentReturnDto {
  @ApiProperty()
  id: number;

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
