import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/users/users.module';
import { TasksModule } from '@/tasks/tasks.module';

import { TaskAssignmentsService } from './task-assignments.service';
import { TaskAssignmentsController } from './task-assignments.controller';
import { TaskAssignment } from './entities/task-assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssignment]), UsersModule, TasksModule],
    controllers: [TaskAssignmentsController],
    providers: [TaskAssignmentsService],
})
export class TaskAssignmentsModule {}
