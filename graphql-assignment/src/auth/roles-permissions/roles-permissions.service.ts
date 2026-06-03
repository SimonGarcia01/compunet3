import { Injectable } from '@nestjs/common';
import { CreateRolePermissionInput } from './dto/create-role-permission.input';
import { UpdateRolePermissionInput } from './dto/update-role-permission.input';

@Injectable()
export class RolesPermissionsService {
    create(createRolePermissionInput: CreateRolePermissionInput) {
        return 'This action adds a new rolesPermission';
    }

    findAll() {
        return `This action returns all rolesPermissions`;
    }

    findOne(id: number) {
        return `This action returns a #${id} rolesPermission`;
    }

    update(id: number, updateRolePermissionInput: UpdateRolePermissionInput) {
        return `This action updates a #${id} rolesPermission`;
    }

    remove(id: number) {
        return `This action removes a #${id} rolesPermission`;
    }
}
