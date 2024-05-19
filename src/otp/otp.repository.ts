import { Injectable, NotFoundException } from '@nestjs/common';
import { OtpTypes } from 'src/enums/otp-types.enum';
import { EntityManager } from 'typeorm';

@Injectable()
export class OtpRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async saveOTP(mobileNumber: string, otp: string, type: OtpTypes) {
    let query = `
      SELECT *
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
    `;

    let foundedNumber = await this.entityManager.query(query, [
      mobileNumber,
      type,
    ]);

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
      await this.entityManager.query(query, [otp, mobileNumber, type]);
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
      await this.entityManager.query(query, [mobileNumber, otp, type]);
    }
  }

  async checkSavedOTP(
    mobileNumber: string,
    otp: string,
    type: OtpTypes,
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

    let obj = await this.entityManager.query(query, [mobileNumber, type]);
    if (!obj[0] || obj[0].otp != otp) {
      // await this.deletePastOTP(mobileNumber);
      throw new NotFoundException('Invalid OTP');
    }

    return true;
  }

  async deletePastOTP(mobileNumber: string, type: OtpTypes): Promise<any> {
    let query = `
      DELETE
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
    `;
    await this.entityManager.query(query, [mobileNumber, type]);
  }
}
