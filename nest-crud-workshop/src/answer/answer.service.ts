import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Question } from '../question/entities/question.entity';
import { Interview } from '../interview/entities/interview.entity';

import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Interview)
        private readonly interviewRepository: Repository<Interview>,
    ) {}

    async create(createAnswerDto: CreateAnswerDto) {
        // Verify Question exists
        const question = await this.questionRepository.findOneBy({
            id: createAnswerDto.questionId,
        });
        if (!question) {
            throw new BadRequestException(`Question with ID ${createAnswerDto.questionId} does not exist`);
        }

        // Verify Interview exists
        const interview = await this.interviewRepository.findOneBy({
            id: createAnswerDto.interviewId,
        });
        if (!interview) {
            throw new BadRequestException(`Interview with ID ${createAnswerDto.interviewId} does not exist`);
        }

        const answer = this.answerRepository.create({
            ...createAnswerDto,
            question,
            interview,
        });
        return this.answerRepository.save(answer);
    }

    async findAll() {
        return this.answerRepository.find();
    }

    async findOne(id: number) {
        const answer = await this.answerRepository.findOneBy({ id });
        if (!answer) {
            throw new NotFoundException(`Answer with ID ${id} not found`);
        }
        return answer;
    }

    async update(id: number, updateAnswerDto: UpdateAnswerDto) {
        // Verify answer exists
        const answer = await this.answerRepository.findOneBy({ id });
        if (!answer) {
            throw new NotFoundException(`Answer with ID ${id} not found`);
        }

        // If question ID is being updated, verify new question exists
        let question: Question | null = null;
        if (updateAnswerDto.questionId) {
            question = await this.questionRepository.findOneBy({
                id: updateAnswerDto.questionId,
            });
            if (!question) {
                throw new BadRequestException(`Question with ID ${updateAnswerDto.questionId} does not exist`);
            }
        }

        // If interview ID is being updated, verify new interview exists
        let interview: Interview | null = null;
        if (updateAnswerDto.interviewId) {
            interview = await this.interviewRepository.findOneBy({
                id: updateAnswerDto.interviewId,
            });
            if (!interview) {
                throw new BadRequestException(`Interview with ID ${updateAnswerDto.interviewId} does not exist`);
            }
        }

        await this.answerRepository.update(id, {
            answer: updateAnswerDto.answer,
            ...(question && { question }),
            ...(interview && { interview }),
        });
        return this.answerRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const answer = await this.answerRepository.findOneBy({ id });
        if (!answer) {
            throw new NotFoundException(`Answer with ID ${id} not found`);
        }
        return this.answerRepository.delete(id);
    }
}
