import { ApiProperty } from '@nestjs/swagger';

export class UploadImageReturnDto {
  @ApiProperty()
  filename: string;
  @ApiProperty()
  path: string;
}
