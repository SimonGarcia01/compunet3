import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';

import { RolePermissionService } from './role-permission.service';
import { RolePermissionInput } from './dtos/rolePermissionInput.dto';

@Controller('/role-permission')
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Get()
    findAll() {
        return this.rolePermissionService.findAll();
    }

    @Get(':roleId/:permissionId')
    findById(@Param('roleId', ParseIntPipe) roleId: number, @Param('permissionId', ParseIntPipe) permissionId: number) {
        return this.rolePermissionService.findById(roleId, permissionId);
    }

    @Post()
    create(@Body() createRolePermissionDto: RolePermissionInput) {
        return this.rolePermissionService.create(createRolePermissionDto);
    }

    @Patch(':roleId/:permissionId')
    update(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('permissionId', ParseIntPipe) permissionId: number,
        @Body() updateRolePermissionDto: Partial<RolePermissionInput>,
    ) {
        return this.rolePermissionService.update(roleId, permissionId, updateRolePermissionDto);
    }

    @Delete(':roleId/:permissionId')
    delete(@Param('roleId', ParseIntPipe) roleId: number, @Param('permissionId', ParseIntPipe) permissionId: number) {
        return this.rolePermissionService.delete(roleId, permissionId);
    }
}
