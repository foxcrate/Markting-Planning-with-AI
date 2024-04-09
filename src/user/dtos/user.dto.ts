export class UserDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  forgetPasswordOtp?: string;
  phoneVerified?: boolean;
  googleId?: string;
  facebookId?: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
