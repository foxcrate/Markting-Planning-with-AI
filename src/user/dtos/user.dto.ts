export class UserDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  google_id?: string;
  facebook_id?: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
