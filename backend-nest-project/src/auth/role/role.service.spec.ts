// src/auth/role/role.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';

import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { RoleNames } from './dto/create-role.dto';


const mockRoleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};


const mockRole: Partial<Role> = {
    id: 1,
    name: RoleNames.ADMIN,
    description: 'Administrator role',
    rolesPermissions: [],
    usersRoles: [],
};

const createRoleDto = {
    name: RoleNames.ADMIN,
    description: 'Administrator role',
};

describe('RoleService', () => {
    let service: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
            ],
        }).compile();

        service = module.get<RoleService>(RoleService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a role successfully', async () => {
            mockRoleRepository.findOne.mockResolvedValue(null);
            mockRoleRepository.create.mockReturnValue(mockRole);
            mockRoleRepository.save.mockResolvedValue(mockRole);

            const result = await service.create(createRoleDto);

            expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { name: createRoleDto.name } });
            expect(mockRoleRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockRole);
        });

        it('should throw ConflictException when role name already exists', async () => {
            mockRoleRepository.findOne.mockResolvedValue(mockRole);

            await expect(service.create(createRoleDto)).rejects.toThrow(ConflictException);
            expect(mockRoleRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of roles', async () => {
            const roles = [mockRole, { ...mockRole, id: 2, name: RoleNames.STUDENT }];
            mockRoleRepository.find.mockResolvedValue(roles);

            const result = await service.findAll();

            expect(mockRoleRepository.find).toHaveBeenCalledWith({
                relations: ['rolesPermissions', 'usersRoles'],
            });
            expect(result).toEqual(roles);
        });

        it('should return empty array when no roles exist', async () => {
            mockRoleRepository.find.mockResolvedValue([]);
            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a role when found', async () => {
            mockRoleRepository.findOne.mockResolvedValue(mockRole);

            const result = await service.findOne(1);

            expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['rolesPermissions', 'usersRoles'],
            });
            expect(result).toEqual(mockRole);
        });

        it('should throw ConflictException when role does not exist', async () => {
            mockRoleRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(9999)).rejects.toThrow(ConflictException);
        });
    });

    describe('update', () => {
        it('should update a role successfully', async () => {
            const updated = { ...mockRole, description: 'Updated description' };
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockRoleRepository.save.mockResolvedValue(updated);

            const result = await service.update(1, { description: 'Updated description' });

            expect(mockRoleRepository.save).toHaveBeenCalled();
            expect(result).toEqual(updated);
        });

        it('should throw ConflictException when role does not exist', async () => {
            mockRoleRepository.findOne.mockResolvedValue(null);

            await expect(service.update(9999, { description: 'X' })).rejects.toThrow(ConflictException);
        });
    });

    describe('remove', () => {
        it('should remove a role successfully', async () => {
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockRoleRepository.remove.mockResolvedValue(mockRole);

            const result = await service.remove(1);

            expect(mockRoleRepository.remove).toHaveBeenCalledWith(mockRole);
            expect(result).toEqual({ message: `Role with ID 1 has been removed` });
        });

        it('should throw ConflictException when role does not exist', async () => {
            mockRoleRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(9999)).rejects.toThrow(ConflictException);
        });
    });
});