import { IsNotEmpty } from 'class-validator';

export class ParamsIdDto {
  @IsNotEmpty()
  id: number;
}
