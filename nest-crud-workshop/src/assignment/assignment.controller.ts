import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Controller('assignment')
export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) {}

    @Post()
    async create(@Body() createAssignmentDto: CreateAssignmentDto) {
        return this.assignmentService.create(createAssignmentDto);
    }

    @Get()
    async findAll() {
        return this.assignmentService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.assignmentService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
        return this.assignmentService.update(+id, updateAssignmentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.assignmentService.remove(+id);
    }
}
