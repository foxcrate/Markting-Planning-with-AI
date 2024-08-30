import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleCreateDto } from './dtos/role-create.dto';
import { RoleReturnDto } from './dtos/role-return.dto';
import { RoleUpdateDto } from './dtos/role-update.dto';
import { PermissionDictionary } from 'src/role/permission.dictionary';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}
  async create(reqBody: RoleCreateDto): Promise<RoleReturnDto> {
    // validate unique name
    let sameNameRole = await this.roleRepository.findByName(reqBody.name);
    if (sameNameRole) {
      throw new BadRequestException('Role already exists');
    }

    if (
      !this.validateNewPermissionsWithSystemPermissions(reqBody.permissions)
    ) {
      throw new BadRequestException('Invalid permissions');
    }

    let newRole = await this.roleRepository.create(reqBody);

    return await this.roleRepository.findById(newRole.id);
  }

  async update(
    updateBody: RoleUpdateDto,
    roleId: number,
  ): Promise<RoleReturnDto> {
    // validate unique name
    let sameNameRole = await this.roleRepository.findByName(updateBody.name);

    if (sameNameRole) {
      if (sameNameRole.id !== Number(roleId)) {
        throw new BadRequestException('Role already exists');
      }
    }

    if (
      !this.validateNewPermissionsWithSystemPermissions(updateBody.permissions)
    ) {
      throw new BadRequestException('Invalid permissions');
    }

    await this.roleRepository.update(updateBody, roleId);
    return await this.getOne(roleId);
  }

  async getOne(roleId: number): Promise<RoleReturnDto> {
    let role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async getAll(): Promise<RoleReturnDto[]> {
    return await this.roleRepository.getAll();
  }

  async delete(roleId: number): Promise<RoleReturnDto> {
    let deletedRole = await this.getOne(roleId);
    await this.roleRepository.deleteById(roleId);
    return deletedRole;
  }

  async getPermissions() {
    return this.replaceStringsWithFalse(PermissionDictionary);
  }

  private validateNewPermissionsWithSystemPermissions(
    newPermissions: Record<string, any>,
  ) {
    for (let key in newPermissions) {
      if (!PermissionDictionary.hasOwnProperty(key)) {
        return false;
      }

      const permissions = newPermissions[key];
      const referencePermissions = PermissionDictionary[key];

      for (let permKey in permissions) {
        if (!referencePermissions.hasOwnProperty(permKey)) {
          return false;
        }
      }
    }

    return true;
  }
  private replaceStringsWithFalse(obj) {
    const newObj = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        newObj[key] = this.replaceStringsWithFalse(obj[key]);
      } else {
        newObj[key] = false;
      }
    }
    return newObj;
  }
}
