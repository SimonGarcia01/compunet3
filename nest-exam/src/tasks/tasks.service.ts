import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectsService } from '@/projects/projects.service';
import { TaskAssignment } from '@/task-assignments/entities/task-assignment.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(TaskAssignment) private readonly taskAssignmentRepository: Repository<TaskAssignment>,
        private readonly projectService: ProjectsService,
    ) {}

    async create(createTaskDto: CreateTaskDto): Promise<Task | null> {
        const project = await this.projectService.findOne(createTaskDto.projectId);
        if (!project) throw new NotFoundException();

        let newTask: Task;

        if (createTaskDto.parentTaskId) {
            const parentTask = await this.findOne(createTaskDto.parentTaskId);
            if (!parentTask)
                throw new NotFoundException('If this task is going to be a subtask, the parents task must exist');

            newTask = this.taskRepository.create({
                ...createTaskDto,
                project: project,
                parentTask: parentTask,
                createdAt: new Date(),
            });
        } else {
            newTask = this.taskRepository.create({
                ...createTaskDto,
                project: project,
                createdAt: new Date(),
            });
        }

        return await this.taskRepository.save(newTask);
    }

    async findAll(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    async findOne(id: number): Promise<Task | null> {
        return this.taskRepository.findOneBy({ id: id });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        const task = await this.findOne(id);
        if (!task) throw new NotFoundException();

        if (task.status === TaskStatus.DONE) {
            throw new BadRequestException('A task in Done status cannot be modified');
        }

        if (updateTaskDto.status && updateTaskDto.status === TaskStatus.IN_PROGRESS) {
            const assignmentsCount = await this.taskAssignmentRepository.count({
                where: { task: { id: id } },
            });

            if (assignmentsCount === 0) {
                throw new BadRequestException('Cannot move to In Progress without at least one assigned user');
            }
        }

        if (
            updateTaskDto.status &&
            (updateTaskDto.status === TaskStatus.REVIEW || updateTaskDto.status === TaskStatus.DONE)
        ) {
            const subtasks = await this.taskRepository.find({
                where: {
                    parentTask: { id: id },
                },
            });

            subtasks.forEach((st) => {
                if (st.status !== TaskStatus.DONE) {
                    throw new BadRequestException(
                        'Parent task cannot move to Review or Done while some subtasks are not DONE',
                    );
                }
            });
        }

        const updated = this.taskRepository.merge(task, updateTaskDto);
        return await this.taskRepository.save(updated);
    }
}
