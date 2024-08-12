import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { ParameterObjectDto } from './parameter-object.dto';
import { RequiredDataDto } from './required-data.dto';

export class TemplateDto {
  name: string;

  type: TemplateTypeEnum;

  description: string;

  example: string;

  maxCharacters: number;

  generatedDocumentsNum: number;

  profilePicture: string;

  categoryId: number;

  requiredData: RequiredDataDto[];

  parameters: ParameterObjectDto[];

  openaiAssistantId: string;
}
