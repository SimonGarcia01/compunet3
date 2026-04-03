import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Type } from '../type/entities/type.entity';
import { Survey } from '../survey/entities/survey.entity';

import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section)
        private readonly sectionRepository: Repository<Section>,
        @InjectRepository(Type)
        private readonly typeRepository: Repository<Type>,
        @InjectRepository(Survey)
        private readonly surveyRepository: Repository<Survey>,
    ) {}

    async create(createSectionDto: CreateSectionDto) {
        // Verify Type exists
        const type = await this.typeRepository.findOneBy({
            id: createSectionDto.typeId,
        });
        if (!type) {
            throw new BadRequestException(`Type with ID ${createSectionDto.typeId} does not exist`);
        }

        // Verify Survey exists
        const survey = await this.surveyRepository.findOneBy({
            id: createSectionDto.surveyId,
        });
        if (!survey) {
            throw new BadRequestException(`Survey with ID ${createSectionDto.surveyId} does not exist`);
        }

        // If parent section is provided, verify it exists
        let parentSection: Section | null = null;
        if (createSectionDto.sectionId) {
            parentSection = await this.sectionRepository.findOneBy({
                id: createSectionDto.sectionId,
            });
            if (!parentSection) {
                throw new BadRequestException(`Parent Section with ID ${createSectionDto.sectionId} does not exist`);
            }
        }

        const section = this.sectionRepository.create({
            ...createSectionDto,
            type,
            survey,
            ...(parentSection && { section: parentSection }),
        });
        return this.sectionRepository.save(section);
    }

    async findAll() {
        return this.sectionRepository.find();
    }

    async findOne(id: number) {
        const section = await this.sectionRepository.findOneBy({ id });
        if (!section) {
            throw new NotFoundException(`Section with ID ${id} not found`);
        }
        return section;
    }

    async update(id: number, updateSectionDto: UpdateSectionDto) {
        // Verify section exists
        const section = await this.sectionRepository.findOneBy({ id });
        if (!section) {
            throw new NotFoundException(`Section with ID ${id} not found`);
        }

        // If type ID is being updated, verify new type exists
        let type: Type | null = null;
        if (updateSectionDto.typeId) {
            type = await this.typeRepository.findOneBy({
                id: updateSectionDto.typeId,
            });
            if (!type) {
                throw new BadRequestException(`Type with ID ${updateSectionDto.typeId} does not exist`);
            }
        }

        // If survey ID is being updated, verify new survey exists
        let survey: Survey | null = null;
        if (updateSectionDto.surveyId) {
            survey = await this.surveyRepository.findOneBy({
                id: updateSectionDto.surveyId,
            });
            if (!survey) {
                throw new BadRequestException(`Survey with ID ${updateSectionDto.surveyId} does not exist`);
            }
        }

        // If parent section is being updated, verify it exists
        let parentSection: Section | null = null;
        if (updateSectionDto.sectionId) {
            parentSection = await this.sectionRepository.findOneBy({
                id: updateSectionDto.sectionId,
            });
            if (!parentSection) {
                throw new BadRequestException(`Parent Section with ID ${updateSectionDto.sectionId} does not exist`);
            }
        }

        await this.sectionRepository.update(id, {
            title: updateSectionDto.title,
            description: updateSectionDto.description,
            tail: updateSectionDto.tail,
            orderCol: updateSectionDto.orderCol,
            backgroundImage: updateSectionDto.backgroundImage,
            ...(type && { type }),
            ...(survey && { survey }),
            ...(parentSection && { section: parentSection }),
        });
        return this.sectionRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const section = await this.sectionRepository.findOneBy({ id });
        if (!section) {
            throw new NotFoundException(`Section with ID ${id} not found`);
        }
        return this.sectionRepository.delete(id);
    }
}
