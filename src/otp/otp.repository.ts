import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';
import { OtpReturnDto } from './dtos/otp-return.dto';
import moment from 'moment';

@Injectable()
export class OtpRepository {
  constructor(
    @Inject(DB_PROVIDER) private db: Pool,
    private configService: ConfigService,
  ) {}

  async saveEmailOTP(mobileNumber: string, otp: string) {
    let query = `
      SELECT
        id,
        phoneNumber,
        otp,
        signedAt,
        createdAt
      FROM otps
      WHERE
      phoneNumber = ?
    `;

    let foundedNumber = await this.db.query(query, [mobileNumber]);

    if (foundedNumber[0]) {
      query = `
      UPDATE otps
      SET
      otp = ?
      WHERE
      phoneNumber = ?
    `;
      await this.db.query(query, [otp, mobileNumber]);
    } else {
      query = `
      INSERT INTO otps
      (
        phoneNumber,
        otp
      )
      VALUES
      (
        ?,
        ?
      )`;
      await this.db.query(query, [mobileNumber, otp]);
    }
  }

  async saveMobileOTP(mobileNumber: string, otp: string) {
    let query = `
      INSERT INTO otps
      (
        phoneNumber,
        otp
      )
      VALUES
      (
        ?,
        ?
      )`;
    await this.db.query(query, [mobileNumber, otp]);
  }

  async signOTP(id: number) {
    let query = `
      UPDATE otps
      SET
      signedAt = UTC_TIMESTAMP()
      WHERE
      id = ?
    `;

    await this.db.query(query, [id]);
  }

  async emailCheckSavedOTP(
    mobileNumber: string,
    otp: string,
  ): Promise<Boolean> {
    let query = `
      SELECT
        id,
        phoneNumber,
        otp,
        signedAt,
        createdAt
      FROM otps
      WHERE
      phoneNumber = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    let obj = await this.db.query(query, [mobileNumber]);

    if (!obj[0] || obj[0].otp != otp) {
      // await this.deletePastOTP(mobileNumber);
      throw new NotFoundException('Invalid OTP');
    }

    return true;
  }

  async checkSavedOTP(phoneNumber: string): Promise<Boolean> {
    let query = `
      SELECT
        id,
        phoneNumber,
        otp,
        signedAt,
        createdAt
      FROM otps
      WHERE
      phoneNumber = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    let obj: OtpReturnDto[] = await this.db.query(query, [phoneNumber]);

    if (!obj[0] || obj[0].signedAt === null) {
      throw new NotFoundException('Invalid OTP');
    }

    console.log('obj[0].signedAt:', obj[0].signedAt);

    let signedAt = moment.utc(obj[0].signedAt);

    let minus = moment.utc();

    console.log('signedAt:', signedAt);

    console.log('minus___:', minus);

    const diffInMs = minus.diff(signedAt, 'minutes');

    console.log('diffInMin:', diffInMs);

    if (diffInMs > this.configService.get('OTP_LIFE_MINUTES')) {
      throw new NotFoundException('Expired OTP');
    }

    return true;
  }

  async findOtp(phoneNumber: string, signed: boolean): Promise<OtpReturnDto> {
    let query = `
      SELECT
      id,
      phoneNumber,
      otp,
      signedAt,
      createdAt
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      ${signed ? 'signedAt IS NOT NULL' : 'signedAt IS NULL'}
      ORDER BY createdAt DESC
      LIMIT 1
    `;
    // console.log(query);

    let obj = await this.db.query(query, [phoneNumber]);
    // console.log(obj);

    return obj[0];
  }

  async deletePastOTP(mobileNumber: string): Promise<any> {
    let query = `
      DELETE
      FROM otps
      WHERE
      phoneNumber = ?
    `;
    await this.db.query(query, [mobileNumber]);
  }
}
