import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AttendanceSuppSessionService } from './attendance-supp-session.service';
import { CreateAttendanceSuppSessionDto } from './dto/create-attendance-supp-session.dto';
import { UpdateAttendanceSuppSessionDto } from './dto/update-attendance-supp-session.dto';

@ApiTags('Attendance-Supp-Sessions')
@Controller('attendance-supp-session')
export class AttendanceSuppSessionController {
    constructor(private readonly attendanceSuppSessionService: AttendanceSuppSessionService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un registro de asistencia de sesion suplementaria' })
    @ApiBody({ type: CreateAttendanceSuppSessionDto })
    @ApiResponse({ status: 201, description: 'Registro de asistencia creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createAttendanceSuppSessionDto: CreateAttendanceSuppSessionDto) {
        return this.attendanceSuppSessionService.create(createAttendanceSuppSessionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los registros de asistencia de sesiones suplementarias' })
    @ApiResponse({ status: 200, description: 'Lista de registros de asistencia' })
    findAll() {
        return this.attendanceSuppSessionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un registro de asistencia por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Registro de asistencia encontrado' })
    @ApiResponse({ status: 404, description: 'Registro de asistencia no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.attendanceSuppSessionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un registro de asistencia' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateAttendanceSuppSessionDto })
    @ApiResponse({ status: 200, description: 'Registro de asistencia actualizado' })
    @ApiResponse({ status: 404, description: 'Registro de asistencia no encontrado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAttendanceSuppSessionDto: UpdateAttendanceSuppSessionDto) {
        return this.attendanceSuppSessionService.update(id, updateAttendanceSuppSessionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un registro de asistencia' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Registro de asistencia eliminado' })
    @ApiResponse({ status: 404, description: 'Registro de asistencia no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.attendanceSuppSessionService.remove(id);
    }
}
