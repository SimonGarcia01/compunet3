import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo curso' })
    @ApiBody({ type: CreateCourseDto })
    @ApiResponse({ status: 201, description: 'Curso creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los cursos' })
    @ApiResponse({ status: 200, description: 'Lista de cursos' })
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un curso por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Curso encontrado' })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un curso' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateCourseDto })
    @ApiResponse({ status: 200, description: 'Curso actualizado' })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un curso' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Curso eliminado' })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.remove(id);
    }
}
