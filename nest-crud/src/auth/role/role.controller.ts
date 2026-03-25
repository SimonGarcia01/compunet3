import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';

import { RoleService } from './role.service';
import { RoleInput } from './dtos/roleInput.dto';

@Controller('/role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.roleService.findById(parseInt(id));
    }

    @Post()
    create(@Body() createRoleDto: RoleInput) {
        return this.roleService.create(createRoleDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: Partial<RoleInput>) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.delete(id);
    }
}
