import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GetPermissionParamsDto } from './dto/get-permission-params.dto';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param() param: GetPermissionParamsDto) {
        return this.permissionService.findOne(param.id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param() param: GetPermissionParamsDto, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(param.id, updatePermissionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param() param: GetPermissionParamsDto) {
        return this.permissionService.remove(param.id);
    }
}
