import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) {}

    @Post()
    async create(@Body() createSurveyDto: CreateSurveyDto) {
        return this.surveyService.create(createSurveyDto);
    }

    @Get()
    async findAll() {
        return this.surveyService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.surveyService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
        return this.surveyService.update(+id, updateSurveyDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.surveyService.remove(+id);
    }
}
