import { TemplateType } from 'src/enums/template-type.enum';
import { ParameterObjectDto } from './parameter-object.dto';

export class TemplateReturnDto {
  id: number;

  name: string;

  type: TemplateType;

  description: string;

  parameters: ParameterObjectDto[];

  openaiAssistantId: string;
}
