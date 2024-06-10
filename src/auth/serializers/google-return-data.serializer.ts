import { GoogleDataReturnDto } from '../dtos/google-data-return.dto';

export class GoogleReturnDataSerializer {
  static serialize(data): GoogleDataReturnDto {
    return {
      googleId: data.sub,
      firstName: data.given_name,
      lastName: data.family_name,
      email: data.email,
      profilePicture: data.picture,
    };
  }
}
