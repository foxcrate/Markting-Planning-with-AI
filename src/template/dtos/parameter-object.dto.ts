import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FunctionCallDataTypes } from 'src/enums/function-call-data-types.enum';

export class ParameterObjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: FunctionCallDataTypes })
  @IsEnum(FunctionCallDataTypes)
  type: FunctionCallDataTypes;
}
