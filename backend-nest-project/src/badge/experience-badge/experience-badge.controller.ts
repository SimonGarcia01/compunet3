import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExperienceBadgeService } from './experience-badge.service';
import { CreateExperienceBadgeDto } from './dto/create-experience-badge.dto';
import { UpdateExperienceBadgeDto } from './dto/update-experience-badge.dto';

@ApiTags('Experience-Badges')
@Controller('experience-badge')
export class ExperienceBadgeController {
    constructor(private readonly experienceBadgeService: ExperienceBadgeService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo experience badge' })
    @ApiBody({ type: CreateExperienceBadgeDto })
    @ApiResponse({ status: 201, description: 'Experience badge creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createExperienceBadgeDto: CreateExperienceBadgeDto) {
        return this.experienceBadgeService.create(createExperienceBadgeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los experience badges' })
    @ApiResponse({ status: 200, description: 'Lista de experience badges' })
    findAll() {
        return this.experienceBadgeService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un experience badge por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Experience badge encontrado' })
    @ApiResponse({ status: 404, description: 'Experience badge no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.experienceBadgeService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un experience badge' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateExperienceBadgeDto })
    @ApiResponse({ status: 200, description: 'Experience badge actualizado' })
    @ApiResponse({ status: 404, description: 'Experience badge no encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateExperienceBadgeDto: UpdateExperienceBadgeDto) {
        return this.experienceBadgeService.update(id, updateExperienceBadgeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un experience badge' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Experience badge eliminado' })
    @ApiResponse({ status: 404, description: 'Experience badge no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.experienceBadgeService.remove(id);
    }
}
