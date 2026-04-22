import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '@/users/users.service';
import { TasksService } from '@/tasks/tasks.service';

import { TaskAssignment } from './entities/task-assignment.entity';
import { CreateTaskAssignmentDto } from './dto/create-task-assignment.dto';

@Injectable()
export class TaskAssignmentsService {
    constructor(
        @InjectRepository(TaskAssignment)
        private readonly taskAssignmentRepository: Repository<TaskAssignment>,
        private readonly userService: UsersService,
        private readonly taskService: TasksService,
    ) {}

    async create(createTaskAssignmentDto: CreateTaskAssignmentDto): Promise<TaskAssignment | null> {
        const user = await this.userService.findOne(createTaskAssignmentDto.userId);
        if (!user) throw new NotFoundException();

        const task = await this.taskService.findOne(createTaskAssignmentDto.taskId);
        if (!task) throw new NotFoundException();

        const newTaskAssignment = this.taskAssignmentRepository.create({
            user: user,
            task: task,
            createdAt: new Date(),
        });
        return this.taskAssignmentRepository.save(newTaskAssignment);
    }

    async findAll(): Promise<TaskAssignment[]> {
        return this.taskAssignmentRepository.find();
    }
}
