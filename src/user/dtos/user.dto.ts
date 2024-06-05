export class UserDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  forgetPasswordOtp?: string;
  credits?: number;
  phoneVerified?: boolean;
  googleId?: string;
  facebookId?: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
