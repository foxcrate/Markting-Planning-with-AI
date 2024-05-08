import { IsEnum, IsString } from 'class-validator';
import { FunctionCallDataTypes } from 'src/enums/function-call-data-types.enum';

export class ParameterObjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(FunctionCallDataTypes)
  type: FunctionCallDataTypes;
}
