import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpCode, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';

import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('User-Roles')
@ApiBearerAuth()
@Controller('user-role')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('Admin')
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una asignacion usuario-rol (solo Admin)' })
    @ApiBody({ type: CreateUserRoleDto })
    @ApiResponse({ status: 201, description: 'Asignacion usuario-rol creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    create(@Body() createUserRoleDto: CreateUserRoleDto) {
        return this.userRoleService.create(createUserRoleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las asignaciones usuario-rol (solo Admin)' })
    @ApiResponse({ status: 200, description: 'Lista de asignaciones usuario-rol' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    findAll() {
        return this.userRoleService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una asignacion usuario-rol por ID (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Asignacion usuario-rol encontrada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Asignacion usuario-rol no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userRoleService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una asignacion usuario-rol (solo Admin)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Asignacion usuario-rol eliminada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere rol Admin)' })
    @ApiResponse({ status: 404, description: 'Asignacion usuario-rol no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userRoleService.remove(id);
    }
}
