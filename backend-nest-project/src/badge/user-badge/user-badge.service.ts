import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

import { UserBadge } from './entities/user-badge.entity';
import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UpdateUserBadgeDto } from './dto/update-user-badge.dto';
import { User } from 'src/auth/user/entities/user.entity';
import { ExperienceBadge } from 'src/badge/experience-badge/entities/experience-badge.entity';

@Injectable()
export class UserBadgeService {
    constructor(
        @InjectRepository(UserBadge)
        private readonly userBadgeRepository: Repository<UserBadge>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ExperienceBadge)
        private readonly experienceBadgeRepository: Repository<ExperienceBadge>,
    ) {}

    async create(createUserBadgeDto: CreateUserBadgeDto): Promise<UserBadge> {
        const { userId, experienceBadgeId, dateAcquired } = createUserBadgeDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const badge = await this.experienceBadgeRepository.findOne({ where: { id: experienceBadgeId } });
        if (!badge) {
            throw new NotFoundException(`Experience badge with ID ${experienceBadgeId} not found`);
        }

        const userBadge = this.userBadgeRepository.create({
            user,
            experienceBadge: badge,
            dateAcquired: dateAcquired ?? new Date(),
        });

        return await this.userBadgeRepository.save(userBadge);
    }

    async findAll(): Promise<UserBadge[]> {
        return await this.userBadgeRepository.find({
            relations: ['user', 'experienceBadge'],
        });
    }

    async findOne(id: number): Promise<UserBadge> {
        const userBadge = await this.userBadgeRepository.findOne({
            where: { id },
            relations: ['user', 'experienceBadge'],
        });
        if (!userBadge) {
            throw new NotFoundException(`User-badge relationship with ID ${id} not found`);
        }
        return userBadge;
    }

    async update(id: number, updateUserBadgeDto: UpdateUserBadgeDto): Promise<UserBadge> {
        const userBadge = await this.findOne(id);
        const { userId, experienceBadgeId, dateAcquired } = updateUserBadgeDto;

        if (userId) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
            userBadge.user = user;
        }

        if (experienceBadgeId) {
            const badge = await this.experienceBadgeRepository.findOne({ where: { id: experienceBadgeId } });
            if (!badge) throw new NotFoundException(`Experience badge with ID ${experienceBadgeId} not found`);
            userBadge.experienceBadge = badge;
        }

        if (dateAcquired) {
            userBadge.dateAcquired = dateAcquired;
        }

        return await this.userBadgeRepository.save(userBadge);
    }

    async remove(id: number): Promise<void> {
        const userBadge = await this.findOne(id);
        await this.userBadgeRepository.remove(userBadge);
    }

    async checkAndAwardBadges(userId: number, level: number): Promise<void> {
        const qualifyingBadges = await this.experienceBadgeRepository.find({
            where: { minLevel: LessThanOrEqual(level) },
        });

        const userBadges = await this.userBadgeRepository.find({
            where: { user: { id: userId } },
            relations: ['experienceBadge'],
        });

        const existingBadgeIds = userBadges.map((ub) => ub.experienceBadge.id);

        for (const badge of qualifyingBadges) {
            if (!existingBadgeIds.includes(badge.id)) {
                const newUserBadge = this.userBadgeRepository.create({
                    user: { id: userId } as any,
                    experienceBadge: badge,
                    dateAcquired: new Date(),
                });
                await this.userBadgeRepository.save(newUserBadge);
            }
        }
    }
}
