import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Thread')
@Controller('thread')
export class ThreadController {}
