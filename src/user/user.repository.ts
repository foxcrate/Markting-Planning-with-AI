import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { DB_PROVIDER } from 'src/db/constants';
import { Pool } from 'mariadb';
import { UpdateSocialDto } from 'src/auth/dtos/update-social.dto';
import { UserRoleEnum } from 'src/enums/user-roles.enum';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Injectable()
export class UserRepository {
  constructor(@Inject(DB_PROVIDER) private db: Pool) {}

  async findUserBySocialIds(
    googleId: string,
    facebookId: string,
  ): Promise<UserDto> {
    const query = `
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.blocked,
          users.type,
          users.authEmail,
          users.contactEmail,
          users.stripeCustomerId,
          users.credits,
          users.roleId,
          users.profilePicture,
          users.phoneNumber,
          users.googleId,
          users.facebookId,
          CASE WHEN roles.id is null THEN null
          ELSE
          JSON_OBJECT(
            'id',roles.id,
            'name', roles.name,
            'permissions', JSON_EXTRACT(roles.permissions,'$')
          )
          END AS role
        FROM users
        LEFT JOIN roles ON users.roleId = roles.id
        WHERE (googleId = ? OR facebookId = ?)
      `;
    let users = await this.db.query(query, [googleId, facebookId]);
    // console.log({ users });

    return users[0];
  }

  async findUsersByGoogleId(googleId): Promise<UserDto> {
    const query = `
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.blocked,
          users.type,
          users.authEmail,
          users.contactEmail,
          users.stripeCustomerId,
          users.credits,
          users.roleId,
          users.profilePicture,
          users.phoneNumber,
          users.googleId,
          users.facebookId,
          CASE WHEN roles.id is null THEN null
          ELSE
          JSON_OBJECT(
            'id',roles.id,
            'name', roles.name,
            'permissions', JSON_EXTRACT(roles.permissions,'$')
          )
          END AS role
        FROM users
        LEFT JOIN roles ON users.roleId = roles.id
        WHERE googleId = ?
      `;
    let users = await this.db.query(query, [googleId]);
    // console.log({ users });

    return users[0];
  }

  async findUsersByFacebookId(facebookId): Promise<UserDto[]> {
    const query = `
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.blocked,
          users.type,
          users.authEmail,
          users.contactEmail,
          users.stripeCustomerId,
          users.credits,
          users.roleId,
          users.profilePicture,
          users.phoneNumber,
          users.googleId,
          users.facebookId,
          CASE WHEN roles.id is null THEN null
          ELSE
          JSON_OBJECT(
            'id',roles.id,
            'name', roles.name,
            'permissions', JSON_EXTRACT(roles.permissions,'$')
          )
          END AS role
        FROM users
        LEFT JOIN roles ON users.roleId = roles.id
        WHERE facebookId = ?
      `;
    let users = this.db.query(query, [facebookId]);
    return users[0];
  }

  async create(user: UserDto): Promise<UserDto> {
    const {
      firstName,
      lastName,
      type,
      profilePicture,
      credits,
      roleId,
      authEmail,
      contactEmail,
      phoneNumber,
      googleId,
      facebookId,
    } = user;

    const query = `
      INSERT INTO users (firstName, lastName, type,profilePicture,credits,roleId,authEmail,contactEmail, phoneNumber${googleId ? ', googleId' : ''}${facebookId ? ', facebookId' : ''}) VALUES (?, ?,?,?,?,?, ?, ?, ?${googleId ? ', ?' : ''}${facebookId ? ', ?' : ''})
    `;
    const params = [
      firstName,
      lastName,
      type ? type : UserRoleEnum.CUSTOMER,
      profilePicture,
      credits ? credits : 0,
      roleId,
      authEmail,
      contactEmail,
      phoneNumber,
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

  async update(updatedUser: UserDto, userId: number): Promise<UserDto> {
    // updateBody.stages[0].
    const query = `
        UPDATE users
        SET
        firstName = IFNULL(?,users.firstName),
        lastName = IFNULL(?,users.lastName),
        blocked = IFNULL(?,users.blocked),
        profilePicture = IFNULL(?,users.profilePicture),
        type = IFNULL(?,users.type),
        contactEmail = IFNULL(?,users.contactEmail),
        credits = IFNULL(?,users.credits),
        phoneNumber = IFNULL(?,users.phoneNumber),
        roleId = IFNULL(?,users.roleId)
        WHERE id = ?
      `;
    await this.db.query(query, [
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.blocked,
      updatedUser.profilePicture,
      updatedUser.type,
      updatedUser.contactEmail,
      updatedUser.credits,
      updatedUser.phoneNumber,
      updatedUser.roleId,
      userId,
    ]);

    return await this.findById(userId);
  }

  async delete(userId: number): Promise<UserDto> {
    let deletedUser = await this.findById(userId);
    const query = `
      DELETE FROM users
      WHERE id = ?
  `;
    await this.db.query(query, [userId]);

    return deletedUser;
  }

  async updateSocial(
    UpdateBody: UpdateSocialDto,
    userId: number,
  ): Promise<UserDto> {
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
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.blocked,
          users.type,
          users.authEmail,
          users.contactEmail,
          users.stripeCustomerId,
          users.credits,
          users.roleId,
          users.profilePicture,
          users.phoneNumber,
          users.googleId,
          users.facebookId,
          CASE WHEN roles.id is null THEN null
          ELSE
          JSON_OBJECT(
            'id',roles.id,
            'name', roles.name,
            'permissions', JSON_EXTRACT(roles.permissions,'$')
          )
          END AS role
        FROM users
        LEFT JOIN roles ON users.roleId = roles.id
        WHERE phoneNumber = ? LIMIT 1
      `;
    const [user] = await this.db.query(query, [phoneNumber]);

    return user;
  }

  async findUserByCommunicateEmail(contactEmail): Promise<UserDto> {
    const query = `
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.blocked,
          users.type,
          users.authEmail,
          users.contactEmail,
          users.stripeCustomerId,
          users.credits,
          users.roleId,
          users.profilePicture,
          users.phoneNumber,
          users.googleId,
          users.facebookId,
          CASE WHEN roles.id is null THEN null
          ELSE
          JSON_OBJECT(
            'id',roles.id,
            'name', roles.name,
            'permissions', JSON_EXTRACT(roles.permissions,'$')
          )
          END AS role
        FROM users
        LEFT JOIN roles ON users.roleId = roles.id
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
      users.blocked,
      users.type,
      users.authEmail,
      users.contactEmail,
      users.stripeCustomerId,
      users.credits,
      users.roleId,
      users.profilePicture,
      users.phoneNumber,
      users.googleId,
      users.facebookId,
      CASE WHEN roles.id is null THEN null
      ELSE
      JSON_OBJECT(
        'id',roles.id,
        'name', roles.name,
        'permissions', JSON_EXTRACT(roles.permissions,'$')
      )
      END AS role
    FROM users
    LEFT JOIN roles ON users.roleId = roles.id
    WHERE users.id = ?
  `;

    const [theUser] = await this.db.query(query, [userId]);

    return theUser;
  }

  async findAll(pagination: PaginationDto): Promise<UserDto[]> {
    let queryParameters = [];
    const queryStart = `
        SELECT
          users.id,
          users.firstName,
          users.lastName,
          users.blocked,
          users.type,
          users.authEmail,
          users.stripeCustomerId,
          users.contactEmail,
          users.credits,
          users.profilePicture,
          users.phoneNumber,
          users.roleId,
          users.googleId,
          users.facebookId,
          CASE WHEN roles.id is null THEN null
          ELSE
          JSON_OBJECT(
            'id',roles.id,
            'name', roles.name,
            'permissions', JSON_EXTRACT(roles.permissions,'$')
          )
          END AS role
        FROM users
        LEFT JOIN roles ON users.roleId = roles.id
      `;

    let paginationQuery = ``;
    if (pagination) {
      paginationQuery = `LIMIT ? OFFSET ?`;
      queryParameters = [pagination.limit, pagination.offset];
    }

    const users = await this.db.query(
      queryStart + paginationQuery,
      queryParameters,
    );

    console.log('all users in admin:', users);

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
