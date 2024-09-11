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
    request['authType'] = payload.authType;

    let theUser = await this.findUserById(request['id']);

    if (!theUser) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    console.log('theUser in auth guard:', theUser);

    if (theUser.role == null) {
      console.log('first condition');

      request['permissions'] = null;
    } else {
      console.log('second condition');

      console.log('theUser.role.permissions:', theUser.role.permissions);

      request['permissions'] = theUser.role.permissions;
    }

    // console.log('request in auth guard:', request);

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

  private async findUserById(userId) {
    let query = `
    SELECT
      users.id,
    CASE WHEN roles.id is null THEN null
    ELSE
    JSON_OBJECT(
      'id',roles.id,
      'name', roles.name,
      'permissions', JSON_EXTRACT(roles.permissions,'$')
    )
    END AS role
    FROM users
    LEFT JOIN roles ON users.roleId = roles.id
    WHERE users.id = ?
  `;

    const [theUser] = await this.entityManager.query(query, [userId]);

    if (theUser.role != null) {
      theUser.role = eval(`(${theUser.role})`);
    }

    return theUser;
  }
}
