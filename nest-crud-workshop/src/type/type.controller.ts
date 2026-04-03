import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    @Post()
    async create(@Body() createTypeDto: CreateTypeDto) {
        return this.typeService.create(createTypeDto);
    }

    @Get()
    async findAll() {
        return this.typeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.typeService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
        return this.typeService.update(+id, updateTypeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.typeService.remove(+id);
    }
}
