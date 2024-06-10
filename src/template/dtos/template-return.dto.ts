import { TemplateType } from 'src/enums/template-type.enum';
import { ParameterObjectDto } from './parameter-object.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TemplateReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: TemplateType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  parameters: ParameterObjectDto[];

  @ApiProperty()
  openaiAssistantId: string;
}
