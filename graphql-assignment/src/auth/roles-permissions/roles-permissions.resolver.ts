import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesPermissionsService } from './roles-permissions.service';

import { CreateRolePermissionInput } from './dto/create-role-permission.input';
import { UpdateRolePermissionInput } from './dto/update-role-permission.input';
import { RolePermission } from './entities/role-permission.entity';

@Resolver(() => RolePermission)
export class RolesPermissionsResolver {
    constructor(private readonly RolesPermissionsService: RolesPermissionsService) {}

    @Mutation(() => RolePermission)
    createRolePermission(@Args('createRolePermissionInput') createRolePermissionInput: CreateRolePermissionInput) {
        return this.RolesPermissionsService.create(createRolePermissionInput);
    }

    @Query(() => [RolePermission], { name: 'RolePermissions' })
    findAll() {
        return this.RolesPermissionsService.findAll();
    }

    @Query(() => RolePermission, { name: 'RolePermission' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.RolesPermissionsService.findOne(id);
    }

    @Mutation(() => RolePermission)
    updateRolePermission(@Args('updateRolePermissionInput') updateRolePermissionInput: UpdateRolePermissionInput) {
        return this.RolesPermissionsService.update(updateRolePermissionInput.id, updateRolePermissionInput);
    }

    @Mutation(() => RolePermission)
    removeRolePermission(@Args('id', { type: () => Int }) id: number) {
        return this.RolesPermissionsService.remove(id);
    }
}
