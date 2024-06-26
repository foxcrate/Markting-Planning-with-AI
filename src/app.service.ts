import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageReturnDto } from './dtos/message-return.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  constructor() {}
  getHello(): MessageReturnDto {
    return { message: 'Hello To Crespo!' };
  }

  async testFirebase() {
    try {
      const user = await admin.auth().getUserByPhoneNumber('+201094016702');
      console.log({ user });
    } catch (error: any) {
      console.log(error);

      if (error.errorInfo.code === 'auth/user-not-found') {
        throw new UnauthorizedException('Wrong OTP');
      }
      throw new ServiceUnavailableException('Firebase Error');
    }
  }
}
