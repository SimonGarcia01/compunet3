import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Controller('interview')
export class InterviewController {
    constructor(private readonly interviewService: InterviewService) {}

    @Post()
    async create(@Body() createInterviewDto: CreateInterviewDto) {
        return this.interviewService.create(createInterviewDto);
    }

    @Get()
    async findAll() {
        return this.interviewService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.interviewService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
        return this.interviewService.update(+id, updateInterviewDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.interviewService.remove(+id);
    }
}
