import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Question } from '../question/entities/question.entity';

import { Metadatum } from './entities/metadatum.entity';
import { CreateMetadatumDto } from './dto/create-metadatum.dto';
import { UpdateMetadatumDto } from './dto/update-metadatum.dto';

@Injectable()
export class MetadataService {
    constructor(
        @InjectRepository(Metadatum)
        private readonly metadataRepository: Repository<Metadatum>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
    ) {}

    async create(createMetadatumDto: CreateMetadatumDto) {
        // Verify Question exists
        const question = await this.questionRepository.findOneBy({
            id: createMetadatumDto.questionId,
        });
        if (!question) {
            throw new BadRequestException(`Question with ID ${createMetadatumDto.questionId} does not exist`);
        }

        const metadatum = this.metadataRepository.create({
            ...createMetadatumDto,
            question,
        });
        return this.metadataRepository.save(metadatum);
    }

    async findAll() {
        return this.metadataRepository.find();
    }

    async findOne(id: number) {
        const metadatum = await this.metadataRepository.findOneBy({ id });
        if (!metadatum) {
            throw new NotFoundException(`Metadatum with ID ${id} not found`);
        }
        return metadatum;
    }

    async update(id: number, updateMetadatumDto: UpdateMetadatumDto) {
        // Verify metadatum exists
        const metadatum = await this.metadataRepository.findOneBy({ id });
        if (!metadatum) {
            throw new NotFoundException(`Metadatum with ID ${id} not found`);
        }

        // If question ID is being updated, verify new question exists
        let question: Question | null = null;
        if (updateMetadatumDto.questionId) {
            question = await this.questionRepository.findOneBy({
                id: updateMetadatumDto.questionId,
            });
            if (!question) {
                throw new BadRequestException(`Question with ID ${updateMetadatumDto.questionId} does not exist`);
            }
        }

        await this.metadataRepository.update(id, {
            key: updateMetadatumDto.key,
            value: updateMetadatumDto.value,
            ...(question && { question }),
        });
        return this.metadataRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const metadatum = await this.metadataRepository.findOneBy({ id });
        if (!metadatum) {
            throw new NotFoundException(`Metadatum with ID ${id} not found`);
        }
        return this.metadataRepository.delete(id);
    }
}
