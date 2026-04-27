import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleNames } from 'src/auth/role/dto/create-role.dto';

@ApiTags('Replies')
@ApiBearerAuth()
@Controller('reply')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva respuesta' })
    @ApiBody({ type: CreateReplyDto })
    @ApiResponse({ status: 201, description: 'Respuesta creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    create(@Body() createReplyDto: CreateReplyDto) {
        return this.replyService.create(createReplyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las respuestas' })
    @ApiResponse({ status: 200, description: 'Lista de respuestas' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    findAll() {
        return this.replyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una respuesta por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Respuesta encontrada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 404, description: 'Respuesta no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.replyService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una respuesta' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdateReplyDto })
    @ApiResponse({ status: 200, description: 'Respuesta actualizada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 404, description: 'Respuesta no encontrada' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateReplyDto: UpdateReplyDto) {
        return this.replyService.update(id, updateReplyDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una respuesta' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Respuesta eliminada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 404, description: 'Respuesta no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.replyService.remove(id);
    }

    @Patch(':id/like')
    @ApiOperation({ summary: 'Dar like a una respuesta' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Like aplicado exitosamente' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 404, description: 'Respuesta no encontrada' })
    like(@Param('id', ParseIntPipe) id: number) {
        return this.replyService.like(id);
    }

    @Patch(':id/validate')
    @Roles(RoleNames.PROFESSOR, RoleNames.TA)
    @ApiOperation({ summary: 'Validar una respuesta (solo Professor o TA)' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Respuesta validada exitosamente' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos (requiere Professor o TA)' })
    @ApiResponse({ status: 404, description: 'Respuesta no encontrada' })
    validate(@Param('id', ParseIntPipe) id: number) {
        return this.replyService.validate(id);
    }
}
