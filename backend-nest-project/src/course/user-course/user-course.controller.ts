import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserCourseService } from './user-course.service';
import { CreateUserCourseDto } from './dto/create-user-course.dto';
import { UpdateUserCourseDto } from './dto/update-user-course.dto';

@ApiTags('User-Courses')
@Controller('user-course')
export class UserCourseController {
    constructor(private readonly userCourseService: UserCourseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una asignacion usuario-curso' })
    @ApiBody({ type: CreateUserCourseDto })
    @ApiResponse({ status: 201, description: 'Asignacion usuario-curso creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createUserCourseDto: CreateUserCourseDto) {
        return this.userCourseService.create(createUserCourseDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las asignaciones usuario-curso' })
    @ApiResponse({ status: 200, description: 'Lista de asignaciones usuario-curso' })
    findAll() {
        return this.userCourseService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una asignacion usuario-curso por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Asignacion usuario-curso encontrada' })
    @ApiResponse({ status: 404, description: 'Asignacion usuario-curso no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userCourseService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una asignacion usuario-curso' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateUserCourseDto })
    @ApiResponse({ status: 200, description: 'Asignacion usuario-curso actualizada' })
    @ApiResponse({ status: 404, description: 'Asignacion usuario-curso no encontrada' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserCourseDto: UpdateUserCourseDto) {
        return this.userCourseService.update(id, updateUserCourseDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una asignacion usuario-curso' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Asignacion usuario-curso eliminada' })
    @ApiResponse({ status: 404, description: 'Asignacion usuario-curso no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userCourseService.remove(id);
    }
}
