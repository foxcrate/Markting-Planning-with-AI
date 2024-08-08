import { IsNotEmpty } from 'class-validator';

export class TemplateCategoryIdDto {
  @IsNotEmpty()
  templateCategoryId: number;
}
