import { FacebookDataReturnDto } from '../dtos/facebook-data-return.dto';

export class FacebookReturnDataSerializer {
  static serialize(data): FacebookDataReturnDto {
    return {
      facebookId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      profilePicture: data.picture.data.url,
    };
  }
}
