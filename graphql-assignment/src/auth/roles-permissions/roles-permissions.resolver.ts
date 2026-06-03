import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesPermissionsService } from './roles-permissions.service';
import { RolesPermission } from './entities/roles-permission.entity';
import { CreateRolesPermissionInput } from './dto/create-roles-permission.input';
import { UpdateRolesPermissionInput } from './dto/update-roles-permission.input';

@Resolver(() => RolesPermission)
export class RolesPermissionsResolver {
    constructor(private readonly rolesPermissionsService: RolesPermissionsService) {}

    @Mutation(() => RolesPermission)
    createRolesPermission(@Args('createRolesPermissionInput') createRolesPermissionInput: CreateRolesPermissionInput) {
        return this.rolesPermissionsService.create(createRolesPermissionInput);
    }

    @Query(() => [RolesPermission], { name: 'rolesPermissions' })
    findAll() {
        return this.rolesPermissionsService.findAll();
    }

    @Query(() => RolesPermission, { name: 'rolesPermission' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.rolesPermissionsService.findOne(id);
    }

    @Mutation(() => RolesPermission)
    updateRolesPermission(@Args('updateRolesPermissionInput') updateRolesPermissionInput: UpdateRolesPermissionInput) {
        return this.rolesPermissionsService.update(updateRolesPermissionInput.id, updateRolesPermissionInput);
    }

    @Mutation(() => RolesPermission)
    removeRolesPermission(@Args('id', { type: () => Int }) id: number) {
        return this.rolesPermissionsService.remove(id);
    }
}
