import { ArrayMinSize, ArrayNotEmpty, IsArray } from 'class-validator';
import { StageCreateDto } from './stage-create.dto';

export class StagesCreateDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  stages: StageCreateDto[];
}
