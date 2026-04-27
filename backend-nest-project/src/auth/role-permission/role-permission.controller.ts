import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';

import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Role-Permissions')
@ApiBearerAuth()
@Controller('role-permission')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('Admin')
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una asignacion rol-permiso (solo Admin)' })
    @ApiBody({ type: CreateRolePermissionDto })
    @ApiResponse({ status: 201, description: 'Asignacion rol-permiso creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
        return this.rolePermissionService.create(createRolePermissionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las asignaciones rol-permiso (solo Admin)' })
    @ApiResponse({ status: 200, description: 'Lista de asignaciones rol-permiso' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    findAll() {
        return this.rolePermissionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una asignacion rol-permiso por ID (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Asignacion rol-permiso encontrada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Asignacion rol-permiso no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.rolePermissionService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una asignacion rol-permiso (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Asignacion rol-permiso eliminada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Asignacion rol-permiso no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.rolePermissionService.remove(id);
    }
}
