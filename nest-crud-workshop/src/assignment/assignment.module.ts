import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Survey } from '../survey/entities/survey.entity';

import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Assignment } from './entities/assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Assignment, Survey])],
    controllers: [AssignmentController],
    providers: [AssignmentService],
    exports: [TypeOrmModule],
})
export class AssignmentModule {}
