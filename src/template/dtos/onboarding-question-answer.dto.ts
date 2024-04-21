import { IsString } from 'class-validator';

export class OnboardingQuestionAnswer {
  @IsString()
  answer: string;
}
