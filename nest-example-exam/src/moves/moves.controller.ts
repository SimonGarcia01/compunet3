import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { MovesService } from './moves.service';
import { CreateMoveDto } from './dto/create-move.dto';

@Controller('moves')
export class MovesController {
    constructor(private readonly movesService: MovesService) {}

    @Post()
    create(@Body() createMoveDto: CreateMoveDto) {
        return this.movesService.create(createMoveDto);
    }

    @Get()
    findAll() {
        return this.movesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.movesService.findOne(id);
    }
}
