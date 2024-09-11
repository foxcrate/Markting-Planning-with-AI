import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/enums/user-roles.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  checkPermissions(
    requiredPermissions: string[],
    userPermissions: Record<string, any>,
  ): boolean {
    // console.log(requiredPermissions);

    if (!requiredPermissions) {
      return true;
    }
    return requiredPermissions.every((permission) => {
      const [resource, action] = permission.split('.');

      if (userPermissions === null) {
        return false;
      }

      if (!userPermissions[resource]) {
        throw new BadRequestException('Permission not found');
      }

      return userPermissions[resource][action] === true;
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const userId = request['id'];
    const userPermissions = request['permissions'];
    const authType = request['authType'];

    if (authType === UserRoleEnum.ADMIN) {
      return true;
    } else if (authType === UserRoleEnum.CUSTOMER) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    console.log('userPermissions:', userPermissions);
    console.log('requiredPermissions:', requiredPermissions);
    console.log('userId:', userId);

    if (!this.checkPermissions(requiredPermissions, userPermissions)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
