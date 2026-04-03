import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Question } from '../question/entities/question.entity';
import { Option } from '../option/entities/option.entity';
import { OptionGroup } from '../option-group/entities/option-group.entity';

import { OptionQuestion } from './entities/option-question.entity';
import { CreateOptionQuestionDto } from './dto/create-option-question.dto';
import { UpdateOptionQuestionDto } from './dto/update-option-question.dto';

@Injectable()
export class OptionQuestionService {
    constructor(
        @InjectRepository(OptionQuestion)
        private readonly optionQuestionRepository: Repository<OptionQuestion>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Option)
        private readonly optionRepository: Repository<Option>,
        @InjectRepository(OptionGroup)
        private readonly optionGroupRepository: Repository<OptionGroup>,
    ) {}

    async create(createOptionQuestionDto: CreateOptionQuestionDto) {
        // Verify Question exists
        const question = await this.questionRepository.findOneBy({
            id: createOptionQuestionDto.questionId,
        });
        if (!question) {
            throw new BadRequestException(`Question with ID ${createOptionQuestionDto.questionId} does not exist`);
        }

        // Verify Option exists (only if provided)
        let option: Option | null = null;
        if (createOptionQuestionDto.optionId) {
            option = await this.optionRepository.findOneBy({
                id: createOptionQuestionDto.optionId,
            });
            if (!option) {
                throw new BadRequestException(`Option with ID ${createOptionQuestionDto.optionId} does not exist`);
            }
        }

        // Verify OptionGroup exists (only if provided)
        let optionGroup: OptionGroup | null = null;
        if (createOptionQuestionDto.groupId) {
            optionGroup = await this.optionGroupRepository.findOneBy({
                id: createOptionQuestionDto.groupId,
            });
            if (!optionGroup) {
                throw new BadRequestException(`OptionGroup with ID ${createOptionQuestionDto.groupId} does not exist`);
            }
        }

        const optionQuestion = this.optionQuestionRepository.create({
            ...createOptionQuestionDto,
            question,
            ...(option && { option }),
            ...(optionGroup && { optionGroup }),
        });
        return this.optionQuestionRepository.save(optionQuestion);
    }

    async findAll() {
        return this.optionQuestionRepository.find();
    }

    async findOne(id: number) {
        const optionQuestion = await this.optionQuestionRepository.findOneBy({ id });
        if (!optionQuestion) {
            throw new NotFoundException(`OptionQuestion with ID ${id} not found`);
        }
        return optionQuestion;
    }

    async update(id: number, updateOptionQuestionDto: UpdateOptionQuestionDto) {
        // Verify optionQuestion exists
        const optionQuestion = await this.optionQuestionRepository.findOneBy({ id });
        if (!optionQuestion) {
            throw new NotFoundException(`OptionQuestion with ID ${id} not found`);
        }

        // If question ID is being updated, verify new question exists
        let question: Question | null = null;
        if (updateOptionQuestionDto.questionId) {
            question = await this.questionRepository.findOneBy({
                id: updateOptionQuestionDto.questionId,
            });
            if (!question) {
                throw new BadRequestException(`Question with ID ${updateOptionQuestionDto.questionId} does not exist`);
            }
        }

        // If option ID is being updated, verify new option exists
        let option: Option | null = null;
        if (updateOptionQuestionDto.optionId) {
            option = await this.optionRepository.findOneBy({
                id: updateOptionQuestionDto.optionId,
            });
            if (!option) {
                throw new BadRequestException(`Option with ID ${updateOptionQuestionDto.optionId} does not exist`);
            }
        }

        // If group ID is being updated, verify new group exists
        let optionGroup: OptionGroup | null = null;
        if (updateOptionQuestionDto.groupId) {
            optionGroup = await this.optionGroupRepository.findOneBy({
                id: updateOptionQuestionDto.groupId,
            });
            if (!optionGroup) {
                throw new BadRequestException(`OptionGroup with ID ${updateOptionQuestionDto.groupId} does not exist`);
            }
        }

        await this.optionQuestionRepository.update(id, {
            ...(question && { question }),
            ...(option && { option }),
            ...(optionGroup && { optionGroup }),
        });
        return this.optionQuestionRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const optionQuestion = await this.optionQuestionRepository.findOneBy({ id });
        if (!optionQuestion) {
            throw new NotFoundException(`OptionQuestion with ID ${id} not found`);
        }
        return this.optionQuestionRepository.delete(id);
    }
}
