import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Controller('option')
export class OptionController {
    constructor(private readonly optionService: OptionService) {}

    @Post()
    async create(@Body() createOptionDto: CreateOptionDto) {
        return this.optionService.create(createOptionDto);
    }

    @Get()
    async findAll() {
        return this.optionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.optionService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
        return this.optionService.update(+id, updateOptionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.optionService.remove(+id);
    }
}
