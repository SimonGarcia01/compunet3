// src/auth/permission/permission.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { PermissionNames } from './dto/create-permission.dto';

const mockPermissionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

const mockPermission: Partial<Permission> = {
    id: 1,
    name: PermissionNames.CREATE,
    description: 'Can create resources',
    rolesPermissions: [],
};

const createPermissionDto = {
    name: PermissionNames.CREATE,
    description: 'Can create resources',
};

describe('PermissionService', () => {
    let service: PermissionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionService,
                { provide: getRepositoryToken(Permission), useValue: mockPermissionRepository },
            ],
        }).compile();

        service = module.get<PermissionService>(PermissionService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a permission successfully', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(null);
            mockPermissionRepository.create.mockReturnValue(mockPermission);
            mockPermissionRepository.save.mockResolvedValue(mockPermission);

            const result = await service.create(createPermissionDto);

            expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
                where: { name: createPermissionDto.name },
            });
            expect(mockPermissionRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockPermission);
        });

        it('should throw ConflictException when permission name already exists', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

            await expect(service.create(createPermissionDto)).rejects.toThrow(ConflictException);
            expect(mockPermissionRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of permissions', async () => {
            const permissions = [
                mockPermission,
                { ...mockPermission, id: 2, name: PermissionNames.READ },
            ];
            mockPermissionRepository.find.mockResolvedValue(permissions);

            const result = await service.findAll();

            expect(mockPermissionRepository.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(permissions);
        });

        it('should return empty array when no permissions exist', async () => {
            mockPermissionRepository.find.mockResolvedValue([]);
            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a permission when found', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

            const result = await service.findOne(1);

            expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockPermission);
        });

        it('should throw NotFoundException when permission does not exist', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a permission successfully', async () => {
            const updated = { ...mockPermission, description: 'Updated description' };
            mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
            mockPermissionRepository.save.mockResolvedValue(updated);

            const result = await service.update(1, { description: 'Updated description' });

            expect(mockPermissionRepository.save).toHaveBeenCalled();
            expect(result).toEqual(updated);
        });

        it('should throw NotFoundException when permission does not exist', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(null);

            await expect(
                service.update(9999, { description: 'X' }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a permission successfully', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
            mockPermissionRepository.remove.mockResolvedValue(mockPermission);

            const result = await service.remove(1);

            expect(mockPermissionRepository.remove).toHaveBeenCalledWith(mockPermission);
            expect(result).toEqual({ message: 'Permission removed successfully' });
        });

        it('should throw NotFoundException when permission does not exist', async () => {
            mockPermissionRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
        });
    });
});