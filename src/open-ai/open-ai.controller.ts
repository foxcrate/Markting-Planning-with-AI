import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OpenAi')
@Controller('open-ai')
export class OpenAiController {}
