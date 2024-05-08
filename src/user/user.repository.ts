import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findUserBySocialIds(
    googleId: string,
    facebookId: string,
  ): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE (googleId = ? OR facebookId = ?)
      `;
    let users = await this.entityManager.query(query, [googleId, facebookId]);
    // console.log({ users });

    return users[0];
  }

  async findUsersByGoogleId(googleId): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE googleId = ?
      `;
    let users = await this.entityManager.query(query, [googleId]);
    // console.log({ users });

    return users[0];
  }

  async findUsersByFacebookId(facebookId): Promise<UserDto[]> {
    const query = `
        SELECT * FROM users
        WHERE facebookId = ?
      `;
    let users = this.entityManager.query(query, [facebookId]);
    return users[0];
  }

  async create(user: UserDto): Promise<UserDto> {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      googleId,
      facebookId,
    } = user;

    const query = `
      INSERT INTO users (firstName, lastName, email, phoneNumber, password${googleId ? ', googleId' : ''}${facebookId ? ', facebook_id' : ''}) VALUES (?, ?, ?, ?, ?${googleId ? ', ?' : ''}${facebookId ? ', ?' : ''})
    `;
    const params = [firstName, lastName, email, phoneNumber, password];
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
      id: createdUser.insertId,
    });
  }

  async verifyPhoneNumber(userId: number) {
    const query = `
        UPDATE users
        SET phoneVerified = true
        WHERE id = ?
      `;
    await this.entityManager.query(query, [userId]);
  }

  async findUserByPhoneNumber(phoneNumber): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE phoneNumber = ? LIMIT 1
      `;
    const [user] = await this.entityManager.query(query, [phoneNumber]);
    return user;
  }

  async updateSocialMedia(
    firstName: string,
    lastName: string,
    email: string,
    googleId: string,
    facebookId: string,
    userId: number,
  ) {
    const query = `
        UPDATE users
        SET
        firstName = ?,
        lastName = ?,
        email = ?,
        googleId = ?,
        facebookId = ?
        WHERE id = ?
      `;
    await this.entityManager.query(query, [
      firstName,
      lastName,
      email,
      googleId,
      facebookId,
      userId,
    ]);
  }

  async findById(userId): Promise<UserDto> {
    let query = `
    SELECT
      users.id,
      users.firstName,
      users.lastName,
      users.email,
      users.phoneVerified,
      users.phoneNumber,
      users.googleId,
      users.facebookId,
      users.forgetPasswordOtp
    FROM users
    WHERE users.id = ?
  `;

    const [theUser] = await this.entityManager.query(query, [userId]);

    return theUser;
  }
}

// async changePassword(password: string, userId: number) {
//   const query = `
//       UPDATE users
//       SET password = ?
//       WHERE id = ?
//     `;
//   await this.entityManager.query(query, [password, userId]);
// }

// async findUserByEmail(email): Promise<UserDto> {
//   const query = `
//       SELECT * FROM users
//       WHERE email = ? LIMIT 1
//     `;
//   const [user] = await this.entityManager.query(query, [email]);
//   return user;
// }

// async verifyEmail(userId: number) {
//   const query = `
//       UPDATE users
//       SET emailVerified = true
//       WHERE id = ?
//     `;
//   await this.entityManager.query(query, [userId]);
// }

// async findUsersByEmailOrGoogleId(email, googleId): Promise<UserDto[]> {
//   const query = `
//       SELECT * FROM users
//       WHERE (email = ? OR googleId = ?)
//     `;
//   return this.entityManager.query(query, [email, googleId]);
// }

// async findUsersByEmail(email): Promise<UserDto[]> {
//   const query = `
//       SELECT * FROM users
//       WHERE email = ?
//     `;
//   return this.entityManager.query(query, [email]);
// }

// async saveForgetPasswordOtp(otp: string, userId: number) {
//   const query = `
//       UPDATE users
//       SET forgetPasswordOtp = ?
//       WHERE id = ?
//     `;
//   await this.entityManager.query(query, [otp, userId]);
// }

// async findUsersByEmailOrFacebookId(email, facebookId): Promise<UserDto[]> {
//   const query = `
//       SELECT * FROM users
//       WHERE (email = ? OR facebookId = ?)
//     `;
//   return this.entityManager.query(query, [email, facebookId]);
// }
