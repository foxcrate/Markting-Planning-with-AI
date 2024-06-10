import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ParameterObjectDto } from './parameter-object.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingTemplateDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: ParameterObjectDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ParameterObjectDto)
  parameters: ParameterObjectDto[];
}
