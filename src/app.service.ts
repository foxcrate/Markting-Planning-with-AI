import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageReturnDto } from './dtos/message-return.dto';
import * as admin from 'firebase-admin';
import * as xlsx from 'xlsx';

@Injectable()
export class AppService {
  constructor() {}
  getHello(): MessageReturnDto {
    return { message: 'Hello To Crespo!' };
  }

  async testFirebase() {
    // try {
    //   let id = '+201550307033';
    //   const user = await admin.auth().getUser(id);
    //   console.log(user.phoneNumber);
    // } catch (error: any) {
    //   console.log(error);
    //   if (error.errorInfo.code === 'auth/user-not-found') {
    //     throw new UnauthorizedException('Wrong OTP');
    //   }
    //   throw new ServiceUnavailableException('Firebase Error');
    // }

    const workbook = xlsx.readFile('./tactics_templates.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let data: any = xlsx.utils.sheet_to_json(worksheet);

    for (let index = 0; index < data.length; index++) {
      let steps = data[index].steps
        .replace(/‘/g, '"')
        .replace(/’/g, '"')
        .replace(/\(/g, '[')
        .replace(/\)/g, ']');
      steps = eval(steps);

      // let steps = data[index].steps;
      console.log(steps);
      let name = data[index].name;
      console.log(name);

      console.log('------------------');
    }
  }
}
