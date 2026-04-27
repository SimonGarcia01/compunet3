import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSupplementarySessionDto } from './dto/create-supplementary-session.dto';
import { UpdateSupplementarySessionDto } from './dto/update-supplementary-session.dto';
import { SupplementarySession } from './entities/supplementary-session.entity';

@Injectable()
export class SupplementarySessionsService {
    constructor(
        @InjectRepository(SupplementarySession)
        private readonly supplementarySessionRepository: Repository<SupplementarySession>,
    ) {}

    async create(createSupplementarySessionDto: CreateSupplementarySessionDto): Promise<SupplementarySession> {
        const supplementarySession = this.supplementarySessionRepository.create(createSupplementarySessionDto);
        return this.supplementarySessionRepository.save(supplementarySession);
    }

    async findAll(): Promise<SupplementarySession[]> {
        return this.supplementarySessionRepository.find({
            relations: ['attendanceRecords'],
        });
    }

    async findOne(id: number): Promise<SupplementarySession> {
        const supplementarySession = await this.supplementarySessionRepository.findOne({
            where: { id },
            relations: ['attendanceRecords'],
        });

        if (!supplementarySession) {
            throw new NotFoundException(`Supplementary session with id ${id} not found`);
        }

        return supplementarySession;
    }

    async update(
        id: number,
        updateSupplementarySessionDto: UpdateSupplementarySessionDto,
    ): Promise<SupplementarySession> {
        const supplementarySession = await this.findOne(id);
        Object.assign(supplementarySession, updateSupplementarySessionDto);
        return this.supplementarySessionRepository.save(supplementarySession);
    }

    async remove(id: number): Promise<{ message: string }> {
        const supplementarySession = await this.findOne(id);
        await this.supplementarySessionRepository.remove(supplementarySession);
        return { message: `Supplementary session with id ${id} has been removed` };
    }
}
