import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OnboardingQuestionAnswer {
  @ApiProperty()
  @IsString()
  answer: string;
}
