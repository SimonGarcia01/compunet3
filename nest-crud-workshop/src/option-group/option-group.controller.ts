import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { OptionGroupService } from './option-group.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';

@Controller('option-group')
export class OptionGroupController {
    constructor(private readonly optionGroupService: OptionGroupService) {}

    @Post()
    async create(@Body() createOptionGroupDto: CreateOptionGroupDto) {
        return this.optionGroupService.create(createOptionGroupDto);
    }

    @Get()
    async findAll() {
        return this.optionGroupService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.optionGroupService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateOptionGroupDto: UpdateOptionGroupDto) {
        return this.optionGroupService.update(+id, updateOptionGroupDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.optionGroupService.remove(+id);
    }
}
