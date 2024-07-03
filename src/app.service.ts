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
      let id = '+201550307033';
      const user = await admin.auth().getUser(id);
      console.log(user.phoneNumber);
    } catch (error: any) {
      console.log(error);

      if (error.errorInfo.code === 'auth/user-not-found') {
        throw new UnauthorizedException('Wrong OTP');
      }
      throw new ServiceUnavailableException('Firebase Error');
    }
  }
}
