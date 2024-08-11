import { ApiProperty } from '@nestjs/swagger';

export class DocumentReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
