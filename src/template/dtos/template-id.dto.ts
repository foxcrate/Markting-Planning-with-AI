import { IsNotEmpty } from 'class-validator';

export class TemplateIdDto {
  @IsNotEmpty()
  templateId: number;
}
