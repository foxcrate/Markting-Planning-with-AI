import { ApiProperty } from '@nestjs/swagger';

export class TemplateCategoryReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
