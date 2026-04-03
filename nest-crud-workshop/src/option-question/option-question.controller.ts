import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { OptionQuestionService } from './option-question.service';
import { CreateOptionQuestionDto } from './dto/create-option-question.dto';
import { UpdateOptionQuestionDto } from './dto/update-option-question.dto';

@Controller('option-question')
export class OptionQuestionController {
    constructor(private readonly optionQuestionService: OptionQuestionService) {}

    @Post()
    async create(@Body() createOptionQuestionDto: CreateOptionQuestionDto) {
        return this.optionQuestionService.create(createOptionQuestionDto);
    }

    @Get()
    async findAll() {
        return this.optionQuestionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.optionQuestionService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateOptionQuestionDto: UpdateOptionQuestionDto) {
        return this.optionQuestionService.update(+id, updateOptionQuestionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.optionQuestionService.remove(+id);
    }
}
