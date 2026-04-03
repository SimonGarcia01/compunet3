import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../project/entities/project.entity';

import { Survey } from './entities/survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveyService {
    constructor(
        @InjectRepository(Survey)
        private readonly surveyRepository: Repository<Survey>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async create(createSurveyDto: CreateSurveyDto) {
        // Verify project exists
        const project = await this.projectRepository.findOneBy({
            id: createSurveyDto.projectId,
        });
        if (!project) {
            throw new BadRequestException(`Project with ID ${createSurveyDto.projectId} does not exist`);
        }

        const survey = this.surveyRepository.create({
            ...createSurveyDto,
            project,
        });
        return this.surveyRepository.save(survey);
    }

    async findAll() {
        return this.surveyRepository.find();
    }

    async findOne(id: number) {
        const survey = await this.surveyRepository.findOneBy({ id });
        if (!survey) {
            throw new NotFoundException(`Survey with ID ${id} not found`);
        }
        return survey;
    }

    async update(id: number, updateSurveyDto: UpdateSurveyDto) {
        // Verify survey exists first
        const survey = await this.surveyRepository.findOneBy({ id });
        if (!survey) {
            throw new NotFoundException(`Survey with ID ${id} not found`);
        }

        // If project ID is being updated, verify new project exists
        let project: Project | null = null;
        if (updateSurveyDto.projectId) {
            project = await this.projectRepository.findOneBy({
                id: updateSurveyDto.projectId,
            });
            if (!project) {
                throw new BadRequestException(`Project with ID ${updateSurveyDto.projectId} does not exist`);
            }
        }

        await this.surveyRepository.update(id, {
            name: updateSurveyDto.name,
            intro: updateSurveyDto.intro,
            outro: updateSurveyDto.outro,
            validation: updateSurveyDto.validation,
            imageUrl: updateSurveyDto.imageUrl,
            styles: updateSurveyDto.styles,
            ...(project && { project }),
        });
        return this.surveyRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const survey = await this.surveyRepository.findOneBy({ id });
        if (!survey) {
            throw new NotFoundException(`Survey with ID ${id} not found`);
        }
        return this.surveyRepository.delete(id);
    }
}
