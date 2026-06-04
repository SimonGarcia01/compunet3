import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RolesPermissionsService } from './roles-permissions.service';

import { RolePermission } from './entities/role-permission.entity';

@Resolver(() => RolePermission)
export class RolesPermissionsResolver {
    constructor(private readonly RolesPermissionsService: RolesPermissionsService) {}

    @Query(() => [RolePermission], { name: 'RolePermissions' })
    findAll() {
        return this.RolesPermissionsService.findAll();
    }

    @Query(() => RolePermission, { name: 'RolePermission' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.RolesPermissionsService.findOne(id);
    }
}
