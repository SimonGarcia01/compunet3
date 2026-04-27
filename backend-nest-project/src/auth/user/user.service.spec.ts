import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Majors } from './dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserBadgeService } from 'src/badge/user-badge/user-badge.service';

const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
};

const mockUserBadgeService = {
    checkAndAwardBadges: jest.fn(),
};

const mockUser: Partial<User> = {
    id: 1,
    email: 'alice@example.com',
    password: '$2b$10$hashedpassword',
    firstName: 'Alice',
    lastName: 'Anderson',
    major1: Majors.SE,
    xp: 10,
    level: 1,
};

const createUserDto = {
    email: 'alice@example.com',
    password: 'Password123',
    firstName: 'Alice',
    lastName: 'Anderson',
    major1: Majors.SE,
    xp: 10,
    level: 1,
};

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: mockUserRepository },
                { provide: UserBadgeService, useValue: mockUserBadgeService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await service.create(createUserDto);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
            expect(result).toEqual(mockUser);
        });

        it('should throw a ConflictException when email already exists', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('addXp', () => {
        it('should add XP and not level up if threshold not met', async () => {
            const user = { ...mockUser, xp: 10, level: 1 };
            mockUserRepository.findOne.mockResolvedValue(user);
            mockUserRepository.save.mockResolvedValue({ ...user, xp: 50 });

            const result = await service.addXp(1, 40);
            expect(result.xp).toBe(50);
            expect(result.level).toBe(1);
            expect(mockUserBadgeService.checkAndAwardBadges).not.toHaveBeenCalled();
        });

        it('should add XP and level up if threshold met', async () => {
            const user = { ...mockUser, xp: 90, level: 1 };
            mockUserRepository.findOne.mockResolvedValue(user);
            mockUserRepository.save.mockResolvedValue({ ...user, xp: 110, level: 2 });

            const result = await service.addXp(1, 20);
            expect(result.level).toBe(2);
            expect(mockUserBadgeService.checkAndAwardBadges).toHaveBeenCalledWith(1, 2);
        });
    });

    describe('findOne', () => {
        it('should return a user when found', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            const result = await service.findOne(1);
            expect(result).toEqual(mockUser);
        });

        it('should throw NotFoundException when user does not exist', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });
});
