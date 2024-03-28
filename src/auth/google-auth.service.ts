import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleUserDto } from './dtos/google-user.dto';

@Injectable()
export class GoogleAuthService {
  private static readonly GOOGLE_CLIENTS_IDS = [
    '958260922715-32un333tnedm8lg55116f27t52q0kgii.apps.googleusercontent.com',
  ];
  private readonly clientOAuth: OAuth2Client;

  constructor() {
    this.clientOAuth = new OAuth2Client();
  }

  async verifyToken(token: string): Promise<GoogleUserDto> {
    try {
      const ticket = await this.clientOAuth.verifyIdToken({
        idToken: token,
        audience: GoogleAuthService.GOOGLE_CLIENTS_IDS,
      });
      const payload = ticket.getPayload();
      if (
        payload.iss !== 'accounts.google.com' &&
        !GoogleAuthService.GOOGLE_CLIENTS_IDS.includes(payload.aud)
      ) {
        throw new UnprocessableEntityException('Invalid google token');
      }

      const { sub: googleId, given_name, family_name, email } = payload;
      return new GoogleUserDto({ googleId, given_name, family_name, email });
    } catch (error) {
      throw new UnprocessableEntityException('Invalid google token');
    }
  }
}
