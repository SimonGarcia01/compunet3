import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ExperienceBadgeService } from './experience-badge.service';
import { ExperienceBadge } from './entities/experience-badge.entity';

describe('ExperienceBadgeService', () => {
    let service: ExperienceBadgeService;
    let repository: Repository<ExperienceBadge>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        merge: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExperienceBadgeService,
                {
                    provide: getRepositoryToken(ExperienceBadge),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<ExperienceBadgeService>(ExperienceBadgeService);
        repository = module.get<Repository<ExperienceBadge>>(getRepositoryToken(ExperienceBadge));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a badge', async () => {
            const dto = { name: 'Badge 1', description: 'Desc', levelRequired: 1, icon: 'icon.png' };
            const badge = { id: 1, ...dto };
            mockRepository.create.mockReturnValue(badge);
            mockRepository.save.mockResolvedValue(badge);

            expect(await service.create(dto)).toEqual(badge);
        });
    });

    describe('findOne', () => {
        it('should return a badge', async () => {
            const badge = { id: 1, name: 'Badge 1' };
            mockRepository.findOne.mockResolvedValue(badge);
            expect(await service.findOne(1)).toEqual(badge);
        });

        it('should throw NotFoundException', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });
});
