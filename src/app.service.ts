import { Injectable } from '@nestjs/common';
import { MessageReturnDto } from './dtos/message-return.dto';

@Injectable()
export class AppService {
  constructor() {}
  getHello(): MessageReturnDto {
    return { message: 'Hello To Crespo!' };
  }
}
