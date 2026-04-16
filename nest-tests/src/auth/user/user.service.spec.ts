import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppLogger } from '@/common/logger/logger.service';

import { User } from '../entities/user.entity';
import { RoleService } from '../role/role.service';

import { UserService } from './user.service';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
};

const mockRoleService = {
    findByName: jest.fn(),
};

const mockLogger = {
    debug: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};

const mockConfigService = {
    get: jest.fn().mockReturnValue('10'),
};

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: mockRepository },
                { provide: RoleService, useValue: mockRoleService },
                { provide: AppLogger, useValue: mockLogger },
                { provide: ConfigService, useValue: mockConfigService },
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

    it('should return all users', async () => {
        const users = [
            {
                id: 1,
                username: 'user1',
                email: 'user1@example.com',
            },
        ];
        mockRepository.find.mockResolvedValue(users);

        const result = await service.findAll();

        expect(mockLogger.debug).toHaveBeenCalledWith('Fetching all users');
        expect(mockRepository.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(users);
    });

    it('should create a user with hashed password and resolved role', async () => {
        const role = { id: 1, name: 'admin' };
        const dto = {
            username: 'user_demo',
            email: 'user_demo@example.com',
            passwordHash: 'secret123',
            bio: 'Test bio',
            roleName: 'admin',
        };
        const hashedPassword = 'hashed-password';
        const savedUser = {
            id: 1,
            ...dto,
            passwordHash: hashedPassword,
            role,
        };

        mockRoleService.findByName.mockResolvedValue(role);
        mockRepository.create.mockReturnValue({
            ...dto,
            passwordHash: hashedPassword,
            role,
        });
        mockRepository.save.mockResolvedValue(savedUser);
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

        const result = await service.create(dto as never);

        expect(mockRoleService.findByName).toHaveBeenCalledWith('admin');
        expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
        expect(mockRepository.create).toHaveBeenCalledWith({
            ...dto,
            passwordHash: hashedPassword,
            role,
        });
        expect(mockRepository.save).toHaveBeenCalledWith({
            ...dto,
            passwordHash: hashedPassword,
            role,
        });
        expect(result).toEqual(savedUser);
    });

    it('should return the user by Id with relations set to false', async () => {
        //Arrange
        //Make the info that will be given to the service and what the repository will return
        const userId = 1;

        const dbUser = {
            id: userId,
            username: 'user1',
            email: 'user@example.com',
        };

        mockRepository.findOne.mockResolvedValue(dbUser);

        //Act
        const result = await service.findOne(userId, false);

        // Assert
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { id: userId },
            relations: [],
        });

        expect(result).toEqual(dbUser);
    });
});
