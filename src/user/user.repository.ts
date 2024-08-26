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
      authEmail,
      contactEmail,
      password,
      phoneNumber,
      googleId,
      facebookId,
    } = user;

    const query = `
      INSERT INTO users (firstName, lastName, authEmail,contactEmail, phoneNumber, password${googleId ? ', googleId' : ''}${facebookId ? ', facebookId' : ''}) VALUES (?, ?,?, ?, ?, ?${googleId ? ', ?' : ''}${facebookId ? ', ?' : ''})
    `;
    const params = [
      firstName,
      lastName,
      authEmail,
      contactEmail,
      phoneNumber,
      password,
    ];
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

  async delete(userId: number) {
    let deletedUser = await this.findById(userId);
    const query = `
      DELETE FROM users
      WHERE id = ?
  `;
    await this.db.query(query, [userId]);

    return deletedUser;
  }

  async updateSocial(UpdateBody: UpdateSocialDto, userId: number) {
    // updateBody.stages[0].
    const query = `
        UPDATE users
        SET
        authEmail = IFNULL(?,users.authEmail),
        googleId = IFNULL(?,users.googleId),
        facebookId = IFNULL(?,users.facebookId)
        WHERE id = ?
      `;
    await this.db.query(query, [
      UpdateBody.authEmail,
      UpdateBody.googleId,
      UpdateBody.facebookId,
      userId,
    ]);

    return await this.findById(userId);
  }

  async updateCommunicateEmail(contactEmail: string, userId: number) {
    const query = `
        UPDATE users
        SET contactEmail = ?
        WHERE id = ?
      `;
    await this.db.query(query, [contactEmail, userId]);
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

  async findUserByCommunicateEmail(contactEmail): Promise<UserDto> {
    const query = `
        SELECT * FROM users
        WHERE contactEmail = ? LIMIT 1
      `;
    const [user] = await this.db.query(query, [contactEmail]);
    return user;
  }

  async updateSocialMedia(
    firstName: string,
    lastName: string,
    authEmail: string,
    googleId: string,
    facebookId: string,
    userId: number,
  ) {
    const query = `
        UPDATE users
        SET
        firstName = ?,
        lastName = ?,
        authEmail = ?,
        googleId = ?,
        facebookId = ?
        WHERE id = ?
      `;
    await this.db.query(query, [
      firstName,
      lastName,
      authEmail,
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
      users.type,
      users.authEmail,
      users.contactEmail,
      users.stripeCustomerId,
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

  async findAll(): Promise<UserDto[]> {
    const query = `
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.type,
          users.authEmail,
          users.stripeCustomerId,
          users.contactEmail,
          users.credits,
          users.profilePicture,
          users.phoneNumber,
          users.googleId,
          users.facebookId,
          users.forgetPasswordOtp
        FROM users
      `;
    const users = await this.db.query(query);
    return users;
  }

  async setStripeCustomerId(stripeCustomerId: string, userId: number) {
    const query = `
        UPDATE users
        SET
        stripeCustomerId = ?
        WHERE id = ?
      `;
    await this.db.query(query, [stripeCustomerId, userId]);
  }
}
