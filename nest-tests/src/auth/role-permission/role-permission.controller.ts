import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { GetRolePermissionParamsDto } from './dto/get-role-permission-params.dto';

@Controller('role-permissions')
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
        return this.rolePermissionService.create(createRolePermissionDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.rolePermissionService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param() param: GetRolePermissionParamsDto) {
        return this.rolePermissionService.findOne(param.id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param() param: GetRolePermissionParamsDto, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
        return this.rolePermissionService.update(param.id, updateRolePermissionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param() param: GetRolePermissionParamsDto) {
        return this.rolePermissionService.remove(param.id);
    }
}
