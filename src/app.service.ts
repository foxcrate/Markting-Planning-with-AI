import {
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageReturnDto } from './dtos/message-return.dto';
import * as admin from 'firebase-admin';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import * as xlsx from 'xlsx';

@Injectable()
export class AppService {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}
  getHello(): MessageReturnDto {
    return { message: 'Hello To Crespo!' };
  }

  async testFirebase() {
    // throw new ServiceUnavailableException('OpenAI API Error');
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

      const kpisArray = data[index].kpi_name
        .replace(/[\[\]()]/g, '')
        .split(',')
        .map((item) => item.trim());

      let object = data[index];
      object.steps = steps;
      object.kpi_name = kpisArray;
      console.log(object);

      console.log('------------------');

      // global stage id
      let globalStageId = 0;
      if (object.global_stage_name === 'Awareness') {
        globalStageId = 1;
      } else if (object.global_stage_name === 'Consideration') {
        globalStageId = 2;
      } else if (object.global_stage_name === 'Conversion') {
        globalStageId = 3;
      } else if (object.global_stage_name === 'Loyalty') {
        globalStageId = 4;
      }

      //measuring frequency
      if (object.kpi_mesuring_frequency === 'Weekly') {
        object.kpi_mesuring_frequency = 'weekly';
      } else if (object.kpi_mesuring_frequency === 'Monthly') {
        object.kpi_mesuring_frequency = 'monthly';
      } else if (object.kpi_mesuring_frequency === 'Daily') {
        object.kpi_mesuring_frequency = 'daily';
      }

      // create tactic
      const query = `
      INSERT INTO tactics (name,private,globalStageId,instance) VALUES (?,?,?,?)
    `;
      const params = [object.name, false, globalStageId, false];

      let { insertId } = await this.db.query(query, params);

      //create kpis
      let kpisTempArray = [];
      for (let i = 0; i < kpisArray.length; i++) {
        kpisTempArray.push([
          insertId,
          kpisArray[i],
          object.kpi_mesuring_frequency,
        ]);
      }

      await this.db.batch(
        `INSERT INTO kpis (tacticId,name,kpiMeasuringFrequency) VALUES (?,?,?)`,
        kpisTempArray,
      );

      //create steps
      let stepsArray = [];
      for (let i = 0; i < steps.length; i++) {
        stepsArray.push([insertId, steps[i][1], steps[i][2], steps[i][0]]);
      }

      await this.db.batch(
        `INSERT INTO tactic_step (tacticId,name,description,theOrder) VALUES (?,?,?,?)`,
        stepsArray,
      );
    }
  }
}
