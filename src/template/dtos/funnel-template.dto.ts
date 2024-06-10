import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ParameterObjectDto } from './parameter-object.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FunnelTemplateDto {
  @ApiProperty()
  @IsString()
  description: string;

  //   @IsArray()
  //   @ArrayMinSize(1)
  //   @ValidateNested({ each: true })
  //   @Type(() => ParameterObjectDto)
  //   parameters: ParameterObjectDto[];
}
