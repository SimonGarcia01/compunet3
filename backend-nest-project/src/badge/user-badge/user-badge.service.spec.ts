import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { UserBadgeService } from './user-badge.service';
import { UserBadge } from './entities/user-badge.entity';
import { User } from 'src/auth/user/entities/user.entity';
import { ExperienceBadge } from 'src/badge/experience-badge/entities/experience-badge.entity';

describe('UserBadgeService', () => {
    let service: UserBadgeService;
    let userBadgeRepository: Repository<UserBadge>;

    const mockUserBadgeRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockExperienceBadgeRepository = {
        findOne: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserBadgeService,
                {
                    provide: getRepositoryToken(UserBadge),
                    useValue: mockUserBadgeRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(ExperienceBadge),
                    useValue: mockExperienceBadgeRepository,
                },
            ],
        }).compile();

        service = module.get<UserBadgeService>(UserBadgeService);
        userBadgeRepository = module.get<Repository<UserBadge>>(getRepositoryToken(UserBadge));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user-badge relationship', async () => {
            const dto = { userId: 1, experienceBadgeId: 1 };
            const user = { id: 1 } as User;
            const badge = { id: 1 } as ExperienceBadge;
            const userBadge = { id: 1, user, experienceBadge: badge };

            mockUserRepository.findOne.mockResolvedValue(user);
            mockExperienceBadgeRepository.findOne.mockResolvedValue(badge);
            mockUserBadgeRepository.create.mockReturnValue(userBadge);
            mockUserBadgeRepository.save.mockResolvedValue(userBadge);

            expect(await service.create(dto)).toEqual(userBadge);
        });

        it('should throw NotFoundException if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            await expect(service.create({ userId: 1, experienceBadgeId: 1 })).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if badge not found', async () => {
            const user = { id: 1 } as User;
            mockUserRepository.findOne.mockResolvedValue(user);
            mockExperienceBadgeRepository.findOne.mockResolvedValue(null);

            await expect(service.create({ userId: 1, experienceBadgeId: 99 })).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return all user-badge relationships', async () => {
            const userBadges = [{ id: 1 }, { id: 2 }] as UserBadge[];
            mockUserBadgeRepository.find.mockResolvedValue(userBadges);

            const result = await service.findAll();

            expect(userBadgeRepository.find).toHaveBeenCalledWith({
                relations: ['user', 'experienceBadge'],
            });
            expect(result).toEqual(userBadges);
        });
    });

    describe('findOne', () => {
        it('should return one user-badge relationship', async () => {
            const userBadge = { id: 1 } as UserBadge;
            mockUserBadgeRepository.findOne.mockResolvedValue(userBadge);

            const result = await service.findOne(1);

            expect(userBadgeRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['user', 'experienceBadge'],
            });
            expect(result).toEqual(userBadge);
        });

        it('should throw NotFoundException if relationship is not found', async () => {
            mockUserBadgeRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update user, badge and dateAcquired', async () => {
            const existing = {
                id: 1,
                user: { id: 1 },
                experienceBadge: { id: 1 },
                dateAcquired: new Date('2026-01-01T00:00:00.000Z'),
            } as UserBadge;
            const newUser = { id: 2 } as User;
            const newBadge = { id: 3 } as ExperienceBadge;
            const newDate = new Date('2026-02-01T00:00:00.000Z');

            mockUserBadgeRepository.findOne.mockResolvedValue(existing);
            mockUserRepository.findOne.mockResolvedValue(newUser);
            mockExperienceBadgeRepository.findOne.mockResolvedValue(newBadge);
            mockUserBadgeRepository.save.mockResolvedValue({
                ...existing,
                user: newUser,
                experienceBadge: newBadge,
                dateAcquired: newDate,
            });

            const result = await service.update(1, {
                userId: 2,
                experienceBadgeId: 3,
                dateAcquired: newDate,
            });

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
            expect(mockExperienceBadgeRepository.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
            expect(mockUserBadgeRepository.save).toHaveBeenCalled();
            expect(result.user.id).toBe(2);
            expect(result.experienceBadge.id).toBe(3);
            expect(result.dateAcquired).toEqual(newDate);
        });

        it('should throw NotFoundException when updating to missing user', async () => {
            const existing = {
                id: 1,
                user: { id: 1 },
                experienceBadge: { id: 1 },
            } as UserBadge;

            mockUserBadgeRepository.findOne.mockResolvedValue(existing);
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.update(1, { userId: 777 })).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when updating to missing badge', async () => {
            const existing = {
                id: 1,
                user: { id: 1 },
                experienceBadge: { id: 1 },
            } as UserBadge;
            const user = { id: 2 } as User;

            mockUserBadgeRepository.findOne.mockResolvedValue(existing);
            mockUserRepository.findOne.mockResolvedValue(user);
            mockExperienceBadgeRepository.findOne.mockResolvedValue(null);

            await expect(service.update(1, { userId: 2, experienceBadgeId: 999 })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove an existing relationship', async () => {
            const existing = {
                id: 1,
                user: { id: 1 },
                experienceBadge: { id: 1 },
            } as UserBadge;

            mockUserBadgeRepository.findOne.mockResolvedValue(existing);
            mockUserBadgeRepository.remove.mockResolvedValue(existing);

            await service.remove(1);

            expect(mockUserBadgeRepository.remove).toHaveBeenCalledWith(existing);
        });

        it('should throw NotFoundException when removing missing relationship', async () => {
            mockUserBadgeRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('checkAndAwardBadges', () => {
        it('should award only badges the user does not have', async () => {
            const qualifyingBadges = [{ id: 1 }, { id: 2 }, { id: 3 }] as ExperienceBadge[];
            const userBadges = [{ experienceBadge: { id: 1 } }] as UserBadge[];

            mockExperienceBadgeRepository.find.mockResolvedValue(qualifyingBadges);
            mockUserBadgeRepository.find.mockResolvedValue(userBadges);
            mockUserBadgeRepository.create.mockImplementation((payload) => payload);
            mockUserBadgeRepository.save.mockResolvedValue({});

            await service.checkAndAwardBadges(10, 5);

            expect(mockExperienceBadgeRepository.find).toHaveBeenCalled();
            expect(mockUserBadgeRepository.find).toHaveBeenCalledWith({
                where: { user: { id: 10 } },
                relations: ['experienceBadge'],
            });
            expect(mockUserBadgeRepository.save).toHaveBeenCalledTimes(2);
        });

        it('should not award new badges when user already has all qualifying badges', async () => {
            const qualifyingBadges = [{ id: 1 }, { id: 2 }] as ExperienceBadge[];
            const userBadges = [
                { experienceBadge: { id: 1 } },
                { experienceBadge: { id: 2 } },
            ] as UserBadge[];

            mockExperienceBadgeRepository.find.mockResolvedValue(qualifyingBadges);
            mockUserBadgeRepository.find.mockResolvedValue(userBadges);

            await service.checkAndAwardBadges(10, 3);

            expect(mockUserBadgeRepository.save).not.toHaveBeenCalled();
        });
    });
});
