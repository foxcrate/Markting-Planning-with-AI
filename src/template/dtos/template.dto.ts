import { TemplateType } from 'src/enums/template-type.enum';
import { TemplateFlowObjectDto } from './template-flow-object.dto';

export class TemplateDto {
  name: string;

  type: TemplateType;

  flow: TemplateFlowObjectDto[];
}
