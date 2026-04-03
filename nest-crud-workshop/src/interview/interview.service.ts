import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Survey } from '../survey/entities/survey.entity';

import { Interview } from './entities/interview.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewService {
    constructor(
        @InjectRepository(Interview)
        private readonly interviewRepository: Repository<Interview>,
        @InjectRepository(Survey)
        private readonly surveyRepository: Repository<Survey>,
    ) {}

    async create(createInterviewDto: CreateInterviewDto) {
        // Verify Survey exists
        const survey = await this.surveyRepository.findOneBy({
            id: createInterviewDto.surveyId,
        });
        if (!survey) {
            throw new BadRequestException(`Survey with ID ${createInterviewDto.surveyId} does not exist`);
        }

        const interview = this.interviewRepository.create({
            timeStart: new Date(createInterviewDto.timeStart),
            timeEnd: new Date(createInterviewDto.timeEnd),
            username: createInterviewDto.username,
            institutionId: createInterviewDto.institutionId,
            interviewerId: createInterviewDto.interviewerId,
            survey,
        });
        return this.interviewRepository.save(interview);
    }

    async findAll() {
        return this.interviewRepository.find();
    }

    async findOne(id: number) {
        const interview = await this.interviewRepository.findOneBy({ id });
        if (!interview) {
            throw new NotFoundException(`Interview with ID ${id} not found`);
        }
        return interview;
    }

    async update(id: number, updateInterviewDto: UpdateInterviewDto) {
        // Verify interview exists
        const interview = await this.interviewRepository.findOneBy({ id });
        if (!interview) {
            throw new NotFoundException(`Interview with ID ${id} not found`);
        }

        // If survey ID is being updated, verify new survey exists
        let survey: Survey | null = null;
        if (updateInterviewDto.surveyId !== undefined) {
            survey = await this.surveyRepository.findOneBy({
                id: updateInterviewDto.surveyId,
            });
            if (!survey) {
                throw new BadRequestException(`Survey with ID ${updateInterviewDto.surveyId} does not exist`);
            }
        }

        await this.interviewRepository.update(id, {
            ...(updateInterviewDto.timeStart && {
                timeStart: new Date(updateInterviewDto.timeStart),
            }),
            ...(updateInterviewDto.timeEnd && {
                timeEnd: new Date(updateInterviewDto.timeEnd),
            }),
            username: updateInterviewDto.username,
            institutionId: updateInterviewDto.institutionId,
            interviewerId: updateInterviewDto.interviewerId,
            ...(survey && { survey }),
        });
        return this.interviewRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const interview = await this.interviewRepository.findOneBy({ id });
        if (!interview) {
            throw new NotFoundException(`Interview with ID ${id} not found`);
        }
        return this.interviewRepository.delete(id);
    }
}
