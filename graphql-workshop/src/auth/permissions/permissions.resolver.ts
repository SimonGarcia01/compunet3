import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';

@Resolver(() => Permission)
export class PermissionsResolver {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Query(() => [Permission], { name: 'permissions' })
    findAll() {
        return this.permissionsService.findAll();
    }

    @Query(() => Permission, { name: 'permission' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.permissionsService.findOne(id);
    }
}
