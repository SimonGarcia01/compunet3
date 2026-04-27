import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permission')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('Admin')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo permiso (solo Admin)' })
    @ApiBody({ type: CreatePermissionDto })
    @ApiResponse({ status: 201, description: 'Permiso creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los permisos (solo Admin)' })
    @ApiResponse({ status: 200, description: 'Lista de permisos' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un permiso por ID (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Permiso encontrado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un permiso (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdatePermissionDto })
    @ApiResponse({ status: 200, description: 'Permiso actualizado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un permiso (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Permiso eliminado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.remove(id);
    }
}
