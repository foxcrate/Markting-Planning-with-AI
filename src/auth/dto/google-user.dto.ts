export class GoogleUserDto {
  googleId: string;
  given_name: string;
  family_name: string;
  email: string;

  constructor(partial: Partial<GoogleUserDto>) {
    Object.assign(this, partial);
  }
}
