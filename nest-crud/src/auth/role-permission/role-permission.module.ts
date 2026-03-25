import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';

import { RolePermission } from './rolePermission.entity';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RolePermission, Role, Permission])],
    providers: [RolePermissionService],
    controllers: [RolePermissionController],
    exports: [RolePermissionService],
})
export class RolePermissionModule {}
