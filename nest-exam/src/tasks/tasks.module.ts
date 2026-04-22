import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '@/projects/projects.module';
import { TaskAssignment } from '@/task-assignments/entities/task-assignment.entity';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task, TaskAssignment]), ProjectsModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
