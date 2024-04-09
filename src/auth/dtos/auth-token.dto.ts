export class AuthTokenDto {
  sub: number;

  tokenType: 'normal' | 'refresh';
}
