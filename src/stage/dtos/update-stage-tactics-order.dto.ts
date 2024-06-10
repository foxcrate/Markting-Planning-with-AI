import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { TacticIdAndOrderDto } from './tacticId-and-order.dto';
import { ApiProperty } from '@nestjs/swagger';

export class updateStageTacticsOrderDto {
  @ApiProperty({ type: TacticIdAndOrderDto, isArray: true })
  @IsArray()
  //   @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TacticIdAndOrderDto)
  tactics: TacticIdAndOrderDto[];
}
