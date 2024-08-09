import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { ParameterObjectDto } from './parameter-object.dto';

export class TemplateDto {
  name: string;

  type: TemplateTypeEnum;

  description: string;

  parameters: ParameterObjectDto[];

  openaiAssistantId: string;
}
