import { IsString } from 'class-validator';

export class OnboardingTemplateDto {
  @IsString()
  name: string;
}
