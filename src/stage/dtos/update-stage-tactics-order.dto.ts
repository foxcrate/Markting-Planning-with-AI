import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { TacticIdAndOrderDto } from './tacticId-and-order.dto';

export class updateStageTacticsOrderDto {
  @IsArray()
  //   @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TacticIdAndOrderDto)
  tactics: TacticIdAndOrderDto[];
}
