import { Controller, Get, Post, Body } from '@nestjs/common';

import { TaskAssignmentsService } from './task-assignments.service';
import { CreateTaskAssignmentDto } from './dto/create-task-assignment.dto';

@Controller('task-assignments')
export class TaskAssignmentsController {
    constructor(private readonly taskAssignmentsService: TaskAssignmentsService) {}

    @Post()
    async create(@Body() createTaskAssignmentDto: CreateTaskAssignmentDto) {
        return await this.taskAssignmentsService.create(createTaskAssignmentDto);
    }

    @Get()
    async findAll() {
        return await this.taskAssignmentsService.findAll();
    }
}
