import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva publicacion' })
    @ApiBody({ type: CreatePostDto })
    @ApiResponse({ status: 201, description: 'Publicacion creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
    create(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las publicaciones' })
    @ApiResponse({ status: 200, description: 'Lista de publicaciones' })
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una publicacion por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Publicacion encontrada' })
    @ApiResponse({ status: 404, description: 'Publicacion no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una publicacion' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiBody({ type: UpdatePostDto })
    @ApiResponse({ status: 200, description: 'Publicacion actualizada' })
    @ApiResponse({ status: 404, description: 'Publicacion no encontrada' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(id, updatePostDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una publicacion' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiResponse({ status: 200, description: 'Publicacion eliminada' })
    @ApiResponse({ status: 404, description: 'Publicacion no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.postService.remove(id);
    }
}
