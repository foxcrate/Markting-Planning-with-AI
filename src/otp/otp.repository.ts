import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class OtpRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async saveOTP(mobileNumber: string, otp: string) {
    let query = `
      SELECT *
      FROM otps
      WHERE phoneNumber = ?
    `;

    let foundedNumber = await this.entityManager.query(query, [mobileNumber]);

    if (foundedNumber[0]) {
      query = `
      UPDATE otps
      SET
      otp = ?
      WHERE
      phoneNumber = ?
    `;
      await this.entityManager.query(query, [otp, mobileNumber]);
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
      await this.entityManager.query(query, [mobileNumber, otp]);
    }
  }

  async checkSavedOTP(mobileNumber: string, otp: string): Promise<any> {
    let query = `
      SELECT
      *
      FROM otps
      WHERE
      phoneNumber = ?
    `;

    let obj = await this.entityManager.query(query, [mobileNumber]);
    if (!obj[0] || obj[0].otp != otp) {
      // await this.deletePastOTP(mobileNumber);
      throw new NotFoundException('Invalid OTP');
    }

    return true;
  }

  async deletePastOTP(mobileNumber: string): Promise<any> {
    let query = `
      DELETE
      FROM otps
      WHERE
      phoneNumber = ?
    `;
    await this.entityManager.query(query, [mobileNumber]);
  }
}
