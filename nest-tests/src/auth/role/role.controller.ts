import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRoleParamsDto } from './dto/get-role-params.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly rolesService: RoleService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param() param: GetRoleParamsDto) {
        return this.rolesService.findOne(param.id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param() param: GetRoleParamsDto, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(param.id, updateRoleDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param() param: GetRoleParamsDto) {
        return this.rolesService.remove(param.id);
    }
}
