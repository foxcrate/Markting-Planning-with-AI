import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { FacebookUserDto } from './dtos/facebook-user-dto';

@Injectable()
export class FacebookAuthService {
  async verifyToken(token: string): Promise<FacebookUserDto> {
    const { facebookId, firstName, lastName, email } =
      await this.getFacebookUserData(token);
    return new FacebookUserDto({ facebookId, firstName, lastName, email });
  }

  async getFacebookUserData(access_token): Promise<{
    facebookId: string;
    firstName: string;
    lastName: string;
    email: string;
  }> {
    try {
      const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          access_token: access_token,
        },
      });

      return {
        facebookId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
      };
    } catch (err) {
      console.log('error in getFacebookUserData() --', err);

      throw new BadRequestException('Error in Facebook Token');
    }
  }
}
