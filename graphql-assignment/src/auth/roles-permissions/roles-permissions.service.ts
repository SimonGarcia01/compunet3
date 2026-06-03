import { Injectable } from '@nestjs/common';
import { CreateRolesPermissionInput } from './dto/create-roles-permission.input';
import { UpdateRolesPermissionInput } from './dto/update-roles-permission.input';

@Injectable()
export class RolesPermissionsService {
    create(createRolesPermissionInput: CreateRolesPermissionInput) {
        return 'This action adds a new rolesPermission';
    }

    findAll() {
        return `This action returns all rolesPermissions`;
    }

    findOne(id: number) {
        return `This action returns a #${id} rolesPermission`;
    }

    update(id: number, updateRolesPermissionInput: UpdateRolesPermissionInput) {
        return `This action updates a #${id} rolesPermission`;
    }

    remove(id: number) {
        return `This action removes a #${id} rolesPermission`;
    }
}
