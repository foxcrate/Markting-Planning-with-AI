import { IsNotEmpty } from 'class-validator';

export class DocumentIdDto {
  @IsNotEmpty()
  documentId: number;
}
