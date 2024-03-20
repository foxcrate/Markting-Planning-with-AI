import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserModel {
  constructor(private readonly entityManager: EntityManager) {}

  async findUsersByEmailOrGoogleId(email, googleId): Promise<UserDto[]> {
    const query = `
        SELECT * FROM users
        WHERE (email = ? OR google_id = ?)
      `;
    return this.entityManager.query(query, [email, googleId]);
  }

  async findUsersByEmailOrFacebookId(email, facebookId): Promise<UserDto[]> {
    const query = `
        SELECT * FROM users
        WHERE (email = ? OR facebook_id = ?)
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
      google_id,
      facebook_id,
    } = user;

    const query = `
      INSERT INTO users (username, email, phoneNumber, password${google_id ? ', google_id' : ''}${facebook_id ? ', facebook_id' : ''}) VALUES (?, ?, ?,?${google_id ? ', ?' : ''}${facebook_id ? ', ?' : ''})
    `;
    const params = [firstName, lastName, email, phoneNumber, password];
    if (google_id) {
      params.push(google_id);
    }
    if (facebook_id) {
      params.push(facebook_id);
    }

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

  async findById(userId) {
    let query = `
    SELECT
      users.id,
      users.username,
      users.email
    FROM users
    WHERE users.id = ?
  `;

    const [theUser] = await this.entityManager.query(query, [userId]);

    return theUser;
  }
}
