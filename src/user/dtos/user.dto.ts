export class UserDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  forgetPasswordOtp?: string;
  emailVerified?: boolean;
  googleId?: string;
  facebookId?: string;
  openAiThreadId?: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
