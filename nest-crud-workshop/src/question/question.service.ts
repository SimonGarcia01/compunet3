import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Type } from '../type/entities/type.entity';
import { Section } from '../section/entities/section.entity';

import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Type)
        private readonly typeRepository: Repository<Type>,
        @InjectRepository(Section)
        private readonly sectionRepository: Repository<Section>,
    ) {}

    async create(createQuestionDto: CreateQuestionDto) {
        // Verify Type exists
        const type = await this.typeRepository.findOneBy({
            id: createQuestionDto.typeId,
        });
        if (!type) {
            throw new BadRequestException(`Type with ID ${createQuestionDto.typeId} does not exist`);
        }

        // Verify Section exists
        let section: Section | null = null;
        if (createQuestionDto.sectionId) {
            section = await this.sectionRepository.findOneBy({
                id: createQuestionDto.sectionId,
            });
            if (!section) {
                throw new BadRequestException(`Section with ID ${createQuestionDto.sectionId} does not exist`);
            }
        }

        // If parent question is provided, verify it exists
        let parentQuestion: Question | null = null;
        if (createQuestionDto.questionId) {
            parentQuestion = await this.questionRepository.findOneBy({
                id: createQuestionDto.questionId,
            });
            if (!parentQuestion) {
                throw new BadRequestException(`Parent Question with ID ${createQuestionDto.questionId} does not exist`);
            }
        }

        const question = this.questionRepository.create({
            ...createQuestionDto,
            type,
            ...(section && { section }),
            ...(parentQuestion && { question: parentQuestion }),
        });
        return this.questionRepository.save(question);
    }

    async findAll() {
        return this.questionRepository.find();
    }

    async findOne(id: number) {
        const question = await this.questionRepository.findOneBy({ id });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }

    async update(id: number, updateQuestionDto: UpdateQuestionDto) {
        // Verify question exists
        const question = await this.questionRepository.findOneBy({ id });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }

        // If type ID is being updated, verify new type exists
        let type: Type | null = null;
        if (updateQuestionDto.typeId) {
            type = await this.typeRepository.findOneBy({
                id: updateQuestionDto.typeId,
            });
            if (!type) {
                throw new BadRequestException(`Type with ID ${updateQuestionDto.typeId} does not exist`);
            }
        }

        // If section ID is being updated, verify new section exists
        let section: Section | null = null;
        if (updateQuestionDto.sectionId) {
            section = await this.sectionRepository.findOneBy({
                id: updateQuestionDto.sectionId,
            });
            if (!section) {
                throw new BadRequestException(`Section with ID ${updateQuestionDto.sectionId} does not exist`);
            }
        }

        // If parent question is being updated, verify it exists
        let parentQuestion: Question | null = null;
        if (updateQuestionDto.questionId) {
            parentQuestion = await this.questionRepository.findOneBy({
                id: updateQuestionDto.questionId,
            });
            if (!parentQuestion) {
                throw new BadRequestException(`Parent Question with ID ${updateQuestionDto.questionId} does not exist`);
            }
        }

        await this.questionRepository.update(id, {
            name: updateQuestionDto.name,
            codQuest: updateQuestionDto.codQuest,
            orderCol: updateQuestionDto.orderCol,
            ...(type && { type }),
            ...(section && { section }),
            ...(parentQuestion && { question: parentQuestion }),
        });
        return this.questionRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const question = await this.questionRepository.findOneBy({ id });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return this.questionRepository.delete(id);
    }
}
