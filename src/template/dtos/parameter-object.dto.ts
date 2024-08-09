import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FunctionCallDataTypeEnum } from 'src/enums/function-call-data-types.enum';

export class ParameterObjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: FunctionCallDataTypeEnum })
  @IsEnum(FunctionCallDataTypeEnum)
  type: FunctionCallDataTypeEnum;
}
