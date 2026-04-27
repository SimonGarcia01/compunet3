import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserBadgeService } from './user-badge.service';
import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UpdateUserBadgeDto } from './dto/update-user-badge.dto';

@ApiTags('User-Badges')
@Controller('user-badge')
export class UserBadgeController {
    constructor(private readonly userBadgeService: UserBadgeService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una asignacion user badge' })
    @ApiBody({ type: CreateUserBadgeDto })
    @ApiResponse({ status: 201, description: 'User badge creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createUserBadgeDto: CreateUserBadgeDto) {
        return this.userBadgeService.create(createUserBadgeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los user badges' })
    @ApiResponse({ status: 200, description: 'Lista de user badges' })
    findAll() {
        return this.userBadgeService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un user badge por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'User badge encontrado' })
    @ApiResponse({ status: 404, description: 'User badge no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userBadgeService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un user badge' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateUserBadgeDto })
    @ApiResponse({ status: 200, description: 'User badge actualizado' })
    @ApiResponse({ status: 404, description: 'User badge no encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserBadgeDto: UpdateUserBadgeDto) {
        return this.userBadgeService.update(id, updateUserBadgeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un user badge' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'User badge eliminado' })
    @ApiResponse({ status: 404, description: 'User badge no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userBadgeService.remove(id);
    }
}
