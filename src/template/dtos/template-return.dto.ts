import { TemplateTypeEnum } from 'src/enums/template-type.enum';
import { ParameterObjectDto } from './parameter-object.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RequiredDataDto } from './required-data.dto';

export class TemplateReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  type: TemplateTypeEnum;

  @ApiProperty()
  description: string;

  @ApiProperty()
  maxCharacters: number;

  @ApiProperty()
  generatedDocumentsNum: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  parameters: ParameterObjectDto[];

  @ApiProperty()
  requiredData: RequiredDataDto[];

  @ApiProperty()
  openaiAssistantId: string;
}
