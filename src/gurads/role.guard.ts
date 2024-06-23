import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // console.log({ roles });

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authType = request['authType'];
    // console.log({ authType });

    let accepted = this.matchRoles(roles, authType);
    // console.log('roles:', roles);
    // console.log('authType:', authType);

    if (!accepted) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
