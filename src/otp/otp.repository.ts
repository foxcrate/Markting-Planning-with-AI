import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'mariadb';
import { DB_PROVIDER } from 'src/db/constants';
import { OtpTypeEnum } from 'src/enums/otp-types.enum';
import { OtpReturnDto } from './dtos/otp-return.dto';

@Injectable()
export class OtpRepository {
  constructor(
    @Inject(DB_PROVIDER) private db: Pool,
    private configService: ConfigService,
  ) {}

  async saveOTP(mobileNumber: string, otp: string, type: OtpTypeEnum) {
    let query = `
      SELECT
        id,
        phoneNumber,
        otp,
        otpType,
        signedAt,
        createdAt
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

  async signOTP(id: number) {
    let query = `
      UPDATE otps
      SET
      signedAt = ${new Date()}
      WHERE
      id = ?
    `;
    await this.db.query(query, [id]);
  }

  async oldCheckSavedOTP(
    mobileNumber: string,
    otp: string,
    type: OtpTypeEnum,
  ): Promise<Boolean> {
    let query = `
      SELECT
        id,
        phoneNumber,
        otp,
        otpType,
        signedAt,
        createdAt
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    let obj = await this.db.query(query, [mobileNumber, type]);

    if (!obj[0] || obj[0].otp != otp) {
      // await this.deletePastOTP(mobileNumber);
      throw new NotFoundException('Invalid OTP');
    }

    return true;
  }

  async checkSavedOTP(
    phoneNumber: string,
    type: OtpTypeEnum,
  ): Promise<Boolean> {
    let query = `
      SELECT
        id,
        phoneNumber,
        otp,
        otpType,
        signedAt,
        createdAt
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    let obj: OtpReturnDto[] = await this.db.query(query, [phoneNumber, type]);

    if (!obj[0] || obj[0].signedAt === null) {
      throw new NotFoundException('Invalid OTP');
    } else if (
      new Date(obj[0].signedAt) <
      new Date(
        Date.now() -
          this.configService.getOrThrow('OTP_LIFE_MINUTES') * 60 * 1000,
      )
    ) {
      throw new NotFoundException('Expired OTP');
    }

    return true;
  }

  async findOtp(
    phoneNumber: string,
    type: OtpTypeEnum,
    signed: boolean,
  ): Promise<OtpReturnDto> {
    let query = `
      SELECT
      id,
      phoneNumber,
      otp,
      otpType,
      signedAt,
      createdAt
      FROM otps
      WHERE
      phoneNumber = ?
      AND
      otpType = ?
      AND
      signed = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    let obj = await this.db.query(query, [phoneNumber, type, signed]);
    return obj[0];
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
