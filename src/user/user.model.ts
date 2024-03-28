import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserModel {
  constructor(private readonly entityManager: EntityManager) {}

  async findUsersByEmailOrGoogleId(email, googleId): Promise<UserDto[]> {
    const query = `
        SELECT * FROM users
        WHERE (email = ? OR googleId = ?)
      `;
    return this.entityManager.query(query, [email, googleId]);
  }

  async verifyEmail(userId) {
    const query = `
        UPDATE users
        SET emailVerified = true
        WHERE id = ?
      `;
    await this.entityManager.query(query, [userId]);
  }

  async saveForgetPasswordOtp(otp: string, userId: number) {
    const query = `
        UPDATE users
        SET forgetPasswordOtp = ?
        WHERE id = ?
      `;
    await this.entityManager.query(query, [otp, userId]);
  }

  async findUsersByEmailOrFacebookId(email, facebookId): Promise<UserDto[]> {
    const query = `
        SELECT * FROM users
        WHERE (email = ? OR facebookId = ?)
      `;
    return this.entityManager.query(query, [email, facebookId]);
  }

  async create(user: UserDto): Promise<UserDto> {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      openAiThreadId,
      googleId,
      facebookId,
    } = user;

    const query = `
      INSERT INTO users (firstName, lastName, email, phoneNumber, openAiThreadId, password${googleId ? ', googleId' : ''}${facebookId ? ', facebook_id' : ''}) VALUES (?, ?, ?, ?, ?, ?${googleId ? ', ?' : ''}${facebookId ? ', ?' : ''})
    `;
    const params = [
      firstName,
      lastName,
      email,
      phoneNumber,
      openAiThreadId,
      password,
    ];
    if (googleId) {
      params.push(googleId);
    }
    if (facebookId) {
      params.push(facebookId);
    }

    // console.log(query);

    const createdUser = await this.entityManager.query(query, params);
    return new UserDto({
      firstName,
      lastName,
      email,
      id: createdUser.insertId,
    });
  }

  async findUserByEmail(email): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE email = ? LIMIT 1
      `;
    const [user] = await this.entityManager.query(query, [email]);
    return user;
  }

  async changePassword(password: string, userId: number) {
    const query = `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `;
    await this.entityManager.query(query, [password, userId]);
  }

  async findById(userId) {
    let query = `
    SELECT
      users.id,
      users.firstName,
      users.lastName,
      users.email
    FROM users
    WHERE users.id = ?
  `;

    const [theUser] = await this.entityManager.query(query, [userId]);

    return theUser;
  }
}
