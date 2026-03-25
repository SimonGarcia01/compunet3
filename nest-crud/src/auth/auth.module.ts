import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { UserService } from './user/user.service';

@Module({
    imports: [UserModule, RoleModule, PermissionModule, RolePermissionModule],
    providers: [UserService],
})
export class AuthModule {}
