import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SupplementarySessionsService } from './supplementary-sessions.service';
import { CreateSupplementarySessionDto } from './dto/create-supplementary-session.dto';
import { UpdateSupplementarySessionDto } from './dto/update-supplementary-session.dto';

@ApiTags('Supplementary-Sessions')
@Controller('supplementary-sessions')
export class SupplementarySessionsController {
    constructor(private readonly supplementarySessionsService: SupplementarySessionsService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una sesion suplementaria' })
    @ApiBody({ type: CreateSupplementarySessionDto })
    @ApiResponse({ status: 201, description: 'Sesion suplementaria creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createSupplementarySessionDto: CreateSupplementarySessionDto) {
        return this.supplementarySessionsService.create(createSupplementarySessionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las sesiones suplementarias' })
    @ApiResponse({ status: 200, description: 'Lista de sesiones suplementarias' })
    findAll() {
        return this.supplementarySessionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una sesion suplementaria por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Sesion suplementaria encontrada' })
    @ApiResponse({ status: 404, description: 'Sesion suplementaria no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.supplementarySessionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una sesion suplementaria' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateSupplementarySessionDto })
    @ApiResponse({ status: 200, description: 'Sesion suplementaria actualizada' })
    @ApiResponse({ status: 404, description: 'Sesion suplementaria no encontrada' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSupplementarySessionDto: UpdateSupplementarySessionDto) {
        return this.supplementarySessionsService.update(id, updateSupplementarySessionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una sesion suplementaria' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Sesion suplementaria eliminada' })
    @ApiResponse({ status: 404, description: 'Sesion suplementaria no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.supplementarySessionsService.remove(id);
    }
}
