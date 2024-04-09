import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly entityManager: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    let payload = this.verifyToken(token);
    // console.log({ payload });

    // let payload: IAuthToken = this.authService.verifyToken(token);
    if (payload.sub == null) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    request['id'] = payload.sub;

    // console.log(await this.userAvailable(request['id']));

    if (!(await this.userAvailable(request['id']))) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private verifyToken(token) {
    try {
      const decoded = this.jwtService.verify(
        token,
        this.config.get('JWT_SECRET'),
      );
      // console.log({ decoded });

      return decoded;
    } catch (error) {
      console.log('error in auth guard:', error);

      return {
        sub: null,
      };
    }
  }

  private async userAvailable(userId) {
    let theUser = await this.findUserById(userId);

    if (!theUser) {
      return false;
    }
    return true;
  }

  private async findUserById(userId) {
    let query = `
    SELECT
      users.id
    FROM users
    WHERE users.id = ?
  `;

    const [theUser] = await this.entityManager.query(query, [userId]);

    return theUser;
  }
}
