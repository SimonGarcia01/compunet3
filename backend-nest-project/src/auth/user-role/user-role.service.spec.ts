// src/auth/user-role/user-role.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UserRoleService } from './user-role.service';
import { UserRole } from './entities/user-role.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Majors } from '../user/dto/create-user.dto';
import { RoleNames } from '../role/dto/create-role.dto';


const mockUserRoleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

const mockUserRepository = {
    findOne: jest.fn(),
};

const mockRoleRepository = {
    findOne: jest.fn(),
};

const mockUser: Partial<User> = {
    id: 1,
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Anderson',
    major1: Majors.SE,
    xp: 10,
    level: 1,
};

const mockRole: Partial<Role> = {
    id: 2,
    name: RoleNames.STUDENT,
    description: 'Student role',
};

const mockUserRole: Partial<UserRole> = {
    id: 1,
    user: mockUser as User,
    role: mockRole as Role,
};

const createUserRoleDto = { userId: 1, roleId: 2 };


describe('UserRoleService', () => {
    let service: UserRoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRoleService,
                { provide: getRepositoryToken(UserRole), useValue: mockUserRoleRepository },
                { provide: getRepositoryToken(User),     useValue: mockUserRepository },
                { provide: getRepositoryToken(Role),     useValue: mockRoleRepository },
            ],
        }).compile();

        service = module.get<UserRoleService>(UserRoleService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should assign a role to a user successfully', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockUserRoleRepository.findOne.mockResolvedValue(null);  
            mockUserRoleRepository.create.mockReturnValue(mockUserRole);
            mockUserRoleRepository.save.mockResolvedValue(mockUserRole);

            const result = await service.create(createUserRoleDto);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
            expect(mockUserRoleRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockUserRole);
        });

        it('should throw NotFoundException when user does not exist', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createUserRoleDto)).rejects.toThrow(NotFoundException);
            expect(mockUserRoleRepository.save).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when role does not exist', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockRoleRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createUserRoleDto)).rejects.toThrow(NotFoundException);
            expect(mockUserRoleRepository.save).not.toHaveBeenCalled();
        });

        it('should throw ConflictException when user already has that role', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole); // ya existe

            await expect(service.create(createUserRoleDto)).rejects.toThrow(ConflictException);
            expect(mockUserRoleRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of user-roles', async () => {
            const userRoles = [mockUserRole];
            mockUserRoleRepository.find.mockResolvedValue(userRoles);

            const result = await service.findAll();

            expect(mockUserRoleRepository.find).toHaveBeenCalledWith({
                relations: ['user', 'role'],
            });
            expect(result).toEqual(userRoles);
        });

        it('should return empty array when no user-roles exist', async () => {
            mockUserRoleRepository.find.mockResolvedValue([]);
            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a user-role when found', async () => {
            mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);

            const result = await service.findOne(1);

            expect(mockUserRoleRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['user', 'role'],
            });
            expect(result).toEqual(mockUserRole);
        });

        it('should throw NotFoundException when user-role does not exist', async () => {
            mockUserRoleRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a user-role successfully', async () => {
            mockUserRoleRepository.findOne.mockResolvedValue(mockUserRole);
            mockUserRoleRepository.remove.mockResolvedValue(mockUserRole);

            const result = await service.remove(1);

            expect(mockUserRoleRepository.remove).toHaveBeenCalledWith(mockUserRole);
            expect(result).toEqual({ message: `User role with id 1 deleted successfully` });
        });

        it('should throw NotFoundException when user-role does not exist', async () => {
            mockUserRoleRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
        });
    });
});