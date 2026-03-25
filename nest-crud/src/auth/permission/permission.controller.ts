import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';

import { PermissionService } from './permission.service';
import { PermissionInput } from './dtos/permissionInput.dto';

@Controller('/permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.permissionService.findById(parseInt(id));
    }

    @Post()
    create(@Body() createPermissionDto: PermissionInput) {
        return this.permissionService.create(createPermissionDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePermissionDto: Partial<PermissionInput>) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.delete(id);
    }
}
