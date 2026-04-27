import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExperienceBadge } from './entities/experience-badge.entity';
import { CreateExperienceBadgeDto } from './dto/create-experience-badge.dto';
import { UpdateExperienceBadgeDto } from './dto/update-experience-badge.dto';

@Injectable()
export class ExperienceBadgeService implements OnModuleInit {
    constructor(
        @InjectRepository(ExperienceBadge)
        private readonly badgeRepository: Repository<ExperienceBadge>,
    ) {}

    async onModuleInit() {
        await this.seedInitialBadges();
    }

    async create(createExperienceBadgeDto: CreateExperienceBadgeDto): Promise<ExperienceBadge> {
        const badge = this.badgeRepository.create(createExperienceBadgeDto);
        return await this.badgeRepository.save(badge);
    }

    async findAll(): Promise<ExperienceBadge[]> {
        return await this.badgeRepository.find();
    }

    async findOne(id: number): Promise<ExperienceBadge> {
        const badge = await this.badgeRepository.findOne({ where: { id } });
        if (!badge) {
            throw new NotFoundException(`Experience badge with ID ${id} not found`);
        }
        return badge;
    }

    async update(id: number, updateExperienceBadgeDto: UpdateExperienceBadgeDto): Promise<ExperienceBadge> {
        const badge = await this.findOne(id);
        const updatedBadge = this.badgeRepository.merge(badge, updateExperienceBadgeDto);
        return await this.badgeRepository.save(updatedBadge);
    }

    async remove(id: number): Promise<void> {
        const badge = await this.findOne(id);
        await this.badgeRepository.remove(badge);
    }

    async seedInitialBadges(): Promise<void> {
        const badges = [
            { name: 'Bronze Scholar', minLevel: 2, message: 'You have started your journey!', associatePrices: 'Study kit access' },
            { name: 'Silver Scholar', minLevel: 5, message: 'You are getting better!', associatePrices: 'Exclusive Discord role' },
            { name: 'Gold Scholar', minLevel: 10, message: 'You are a true expert!', associatePrices: 'Certification of Merit' },
        ];

        for (const badgeData of badges) {
            const exists = await this.badgeRepository.findOne({ where: { name: badgeData.name } });
            if (!exists) {
                const badge = this.badgeRepository.create(badgeData);
                await this.badgeRepository.save(badge);
            }
        }
    }
}
