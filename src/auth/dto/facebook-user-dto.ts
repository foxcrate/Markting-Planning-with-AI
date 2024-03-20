export class FacebookUserDto {
  facebookId: string;
  firstName: string;
  lastName: string;
  email: string;

  constructor(partial: Partial<FacebookUserDto>) {
    Object.assign(this, partial);
  }
}
