import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { UpdateProfileDto } from './dtos/update-profile-dto';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { UpdateSocialDto } from 'src/auth/dtos/update-social.dto';

@Injectable()
export class UserRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async findUserBySocialIds(
    googleId: string,
    facebookId: string,
  ): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE (googleId = ? OR facebookId = ?)
      `;
    let users = await this.db.query(query, [googleId, facebookId]);
    // console.log({ users });

    return users[0];
  }

  async findUsersByGoogleId(googleId): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE googleId = ?
      `;
    let users = await this.db.query(query, [googleId]);
    // console.log({ users });

    return users[0];
  }

  async findUsersByFacebookId(facebookId): Promise<UserDto[]> {
    const query = `
        SELECT * FROM users
        WHERE facebookId = ?
      `;
    let users = this.db.query(query, [facebookId]);
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
      INSERT INTO users (firstName, lastName, email, phoneNumber, password${googleId ? ', googleId' : ''}${facebookId ? ', facebookId' : ''}) VALUES (?, ?, ?, ?, ?${googleId ? ', ?' : ''}${facebookId ? ', ?' : ''})
    `;
    const params = [firstName, lastName, email, phoneNumber, password];
    if (googleId) {
      params.push(googleId);
    }
    if (facebookId) {
      params.push(facebookId);
    }

    // console.log(query);

    const createdUser = await this.db.query(query, params);
    return await this.findById(createdUser.insertId);
  }

  async update(UpdateProfileBody: UpdateProfileDto, userId: number) {
    // updateBody.stages[0].
    const query = `
        UPDATE users
        SET
        firstName = IFNULL(?,users.firstName),
        lastName = IFNULL(?,users.lastName),
        profilePicture = IFNULL(?,users.profilePicture)
        WHERE id = ?
      `;
    await this.db.query(query, [
      UpdateProfileBody.firstName,
      UpdateProfileBody.lastName,
      UpdateProfileBody.profilePicture,
      userId,
    ]);

    return await this.findById(userId);
  }

  async updateSocial(UpdateBody: UpdateSocialDto, userId: number) {
    // updateBody.stages[0].
    const query = `
        UPDATE users
        SET
        email = IFNULL(?,users.email),
        googleId = IFNULL(?,users.googleId),
        facebookId = IFNULL(?,users.facebookId)
        WHERE id = ?
      `;
    await this.db.query(query, [
      UpdateBody.email,
      UpdateBody.googleId,
      UpdateBody.facebookId,
      userId,
    ]);

    return await this.findById(userId);
  }

  // async verifyPhoneNumber(userId: number) {
  //   const query = `
  //       UPDATE users
  //       SET phoneVerified = true
  //       WHERE id = ?
  //     `;
  //   await this.db.query(query, [userId]);
  // }

  async updateEmail(email: string, userId: number) {
    const query = `
        UPDATE users
        SET email = ?
        WHERE id = ?
      `;
    await this.db.query(query, [email, userId]);
  }

  async updatePhoneNumber(phoneNumber: string, userId: number) {
    const query = `
        UPDATE users
        SET phoneNumber = ?
        WHERE id = ?
      `;
    await this.db.query(query, [phoneNumber, userId]);
  }

  async findUserByPhoneNumber(phoneNumber): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE phoneNumber = ? LIMIT 1
      `;
    const [user] = await this.db.query(query, [phoneNumber]);

    return user;
  }

  async findUserByEmail(email): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE email = ? LIMIT 1
      `;
    const [user] = await this.db.query(query, [email]);
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
    await this.db.query(query, [
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
      users.credits,
      users.profilePicture,
      users.phoneNumber,
      users.googleId,
      users.facebookId,
      users.forgetPasswordOtp
    FROM users
    WHERE users.id = ?
  `;

    const [theUser] = await this.db.query(query, [userId]);

    return theUser;
  }
}

// async changePassword(password: string, userId: number) {
//   const query = `
//       UPDATE users
//       SET password = ?
//       WHERE id = ?
//     `;
//   await this.db.query(query, [password, userId]);
// }

// async findUserByEmail(email): Promise<UserDto> {
//   const query = `
//       SELECT * FROM users
//       WHERE email = ? LIMIT 1
//     `;
//   const [user] = await this.db.query(query, [email]);
//   return user;
// }

// async verifyEmail(userId: number) {
//   const query = `
//     UPDATE users
//     SET emailVerified = true
//     WHERE id = ?
//   `;
//   await this.db.query(query, [userId]);
// }

// async findUsersByEmailOrGoogleId(email, googleId): Promise<UserDto[]> {
//   const query = `
//       SELECT * FROM users
//       WHERE (email = ? OR googleId = ?)
//     `;
//   return this.db.query(query, [email, googleId]);
// }

// async findUsersByEmail(email): Promise<UserDto[]> {
//   const query = `
//       SELECT * FROM users
//       WHERE email = ?
//     `;
//   return this.db.query(query, [email]);
// }

// async saveForgetPasswordOtp(otp: string, userId: number) {
//   const query = `
//       UPDATE users
//       SET forgetPasswordOtp = ?
//       WHERE id = ?
//     `;
//   await this.db.query(query, [otp, userId]);
// }

// async findUsersByEmailOrFacebookId(email, facebookId): Promise<UserDto[]> {
//   const query = `
//       SELECT * FROM users
//       WHERE (email = ? OR facebookId = ?)
//     `;
//   return this.db.query(query, [email, facebookId]);

// }
