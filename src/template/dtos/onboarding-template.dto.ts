import { Validate } from 'class-validator';
import { TemplateFlowObjectDto } from './template-flow-object.dto';
import { keyValueFlowValidator } from '../validators/key-value-flow.validator';

export class OnboardingTemplateDto {
  // @IsOptional()
  // @IsString()
  // name: string;

  // @IsOptional()
  // @IsEnum(TemplateType)
  // type: TemplateType;

  @Validate(keyValueFlowValidator)
  flow: TemplateFlowObjectDto[];
}
