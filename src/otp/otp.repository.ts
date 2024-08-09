import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';

@Injectable()
export class OtpRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async saveOTP(mobileNumber: string, otp: string, type: OtpTypeEnum) {
    let query = `
      SELECT *
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
    `;

    let foundedNumber = await this.db.query(query, [mobileNumber, type]);

    if (foundedNumber[0]) {
      query = `
      UPDATE otps
      SET
      otp = ?
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
    `;
      await this.db.query(query, [otp, mobileNumber, type]);
    } else {
      query = `
      INSERT INTO otps
      (
        phoneNumber,
        otp,
        otpType
      )
      VALUES
      (
        ?,
        ?,
        ?
      )`;
      await this.db.query(query, [mobileNumber, otp, type]);
    }
  }

  async checkSavedOTP(
    mobileNumber: string,
    otp: string,
    type: OtpTypeEnum,
  ): Promise<any> {
    let query = `
      SELECT
      *
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
      ORDER BY createdAt DESC
    `;

    let obj = await this.db.query(query, [mobileNumber, type]);
    if (!obj[0] || obj[0].otp != otp) {
      // await this.deletePastOTP(mobileNumber);
      throw new NotFoundException('Invalid OTP');
    }

    return true;
  }

  async deletePastOTP(mobileNumber: string, type: OtpTypeEnum): Promise<any> {
    let query = `
      DELETE
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
    `;
    await this.db.query(query, [mobileNumber, type]);
  }
}
