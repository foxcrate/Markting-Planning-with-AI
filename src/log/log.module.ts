import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { LogRepository } from './log.repository';

@Global()
@Module({
  providers: [LogService, LogRepository],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}
