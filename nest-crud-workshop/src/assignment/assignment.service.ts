import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Survey } from '../survey/entities/survey.entity';

import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Assignment)
        private readonly assignmentRepository: Repository<Assignment>,
        @InjectRepository(Survey)
        private readonly surveyRepository: Repository<Survey>,
    ) {}

    async create(createAssignmentDto: CreateAssignmentDto) {
        // Verify Survey exists
        const survey = await this.surveyRepository.findOneBy({
            id: createAssignmentDto.surveyId,
        });
        if (!survey) {
            throw new BadRequestException(`Survey with ID ${createAssignmentDto.surveyId} does not exist`);
        }

        const assignment = this.assignmentRepository.create({
            ...createAssignmentDto,
            survey,
        });
        return this.assignmentRepository.save(assignment);
    }

    async findAll() {
        return this.assignmentRepository.find();
    }

    async findOne(id: number) {
        const assignment = await this.assignmentRepository.findOneBy({ id });
        if (!assignment) {
            throw new NotFoundException(`Assignment with ID ${id} not found`);
        }
        return assignment;
    }

    async update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
        // Verify assignment exists
        const assignment = await this.assignmentRepository.findOneBy({ id });
        if (!assignment) {
            throw new NotFoundException(`Assignment with ID ${id} not found`);
        }

        // If survey ID is being updated, verify new survey exists
        let survey: Survey | null = null;
        if (updateAssignmentDto.surveyId) {
            survey = await this.surveyRepository.findOneBy({
                id: updateAssignmentDto.surveyId,
            });
            if (!survey) {
                throw new BadRequestException(`Survey with ID ${updateAssignmentDto.surveyId} does not exist`);
            }
        }

        await this.assignmentRepository.update(id, {
            amount: updateAssignmentDto.amount,
            userId: updateAssignmentDto.userId,
            ...(survey && { survey }),
        });
        return this.assignmentRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const assignment = await this.assignmentRepository.findOneBy({ id });
        if (!assignment) {
            throw new NotFoundException(`Assignment with ID ${id} not found`);
        }
        return this.assignmentRepository.delete(id);
    }
}
