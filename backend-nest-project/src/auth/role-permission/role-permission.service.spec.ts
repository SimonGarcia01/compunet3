// src/auth/role-permission/role-permission.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { RolePermissionService } from './role-permission.service';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RoleNames } from '../role/dto/create-role.dto';
import { PermissionNames } from '../permission/dto/create-permission.dto';


const mockRolePermissionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

const mockRoleRepository = {
    findOne: jest.fn(),
};

const mockPermissionRepository = {
    findOne: jest.fn(),
};

const mockRole: Partial<Role> = {
    id: 1,
    name: RoleNames.ADMIN,
    description: 'Admin role',
};

const mockPermission: Partial<Permission> = {
    id: 1,
    name: PermissionNames.CREATE,
    description: 'Can create',
};

const mockRolePermission: Partial<RolePermission> = {
    id: 1,
    role: mockRole as Role,
    permission: mockPermission as Permission,
};

const createRolePermissionDto = { roleId: 1, permissionId: 1 };

describe('RolePermissionService', () => {
    let service: RolePermissionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolePermissionService,
                { provide: getRepositoryToken(RolePermission), useValue: mockRolePermissionRepository },
                { provide: getRepositoryToken(Role),           useValue: mockRoleRepository },
                { provide: getRepositoryToken(Permission),     useValue: mockPermissionRepository },
            ],
        }).compile();

        service = module.get<RolePermissionService>(RolePermissionService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should assign a permission to a role successfully', async () => {
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
            mockRolePermissionRepository.findOne.mockResolvedValue(null); // no existe aún
            mockRolePermissionRepository.create.mockReturnValue(mockRolePermission);
            mockRolePermissionRepository.save.mockResolvedValue(mockRolePermission);

            const result = await service.create(createRolePermissionDto);

            expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRolePermissionRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockRolePermission);
        });

        it('should throw NotFoundException when role does not exist', async () => {
            mockRoleRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createRolePermissionDto)).rejects.toThrow(NotFoundException);
            expect(mockRolePermissionRepository.save).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when permission does not exist', async () => {
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockPermissionRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createRolePermissionDto)).rejects.toThrow(NotFoundException);
            expect(mockRolePermissionRepository.save).not.toHaveBeenCalled();
        });

        it('should throw ConflictException when role already has that permission', async () => {
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            mockPermissionRepository.findOne.mockResolvedValue(mockPermission);
            mockRolePermissionRepository.findOne.mockResolvedValue(mockRolePermission); // ya existe

            await expect(service.create(createRolePermissionDto)).rejects.toThrow(ConflictException);
            expect(mockRolePermissionRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return an array of role-permissions', async () => {
            const rolePermissions = [mockRolePermission];
            mockRolePermissionRepository.find.mockResolvedValue(rolePermissions);

            const result = await service.findAll();

            expect(mockRolePermissionRepository.find).toHaveBeenCalledWith({
                relations: ['role', 'permission'],
            });
            expect(result).toEqual(rolePermissions);
        });

        it('should return empty array when no role-permissions exist', async () => {
            mockRolePermissionRepository.find.mockResolvedValue([]);
            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a role-permission when found', async () => {
            mockRolePermissionRepository.findOne.mockResolvedValue(mockRolePermission);

            const result = await service.findOne(1);

            expect(mockRolePermissionRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['role', 'permission'],
            });
            expect(result).toEqual(mockRolePermission);
        });

        it('should throw NotFoundException when role-permission does not exist', async () => {
            mockRolePermissionRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a role-permission successfully', async () => {
            mockRolePermissionRepository.findOne.mockResolvedValue(mockRolePermission);
            mockRolePermissionRepository.remove.mockResolvedValue(mockRolePermission);

            const result = await service.remove(1);

            expect(mockRolePermissionRepository.remove).toHaveBeenCalledWith(mockRolePermission);
            expect(result).toEqual({ message: `Role permission with id 1 has been removed` });
        });

        it('should throw NotFoundException when role-permission does not exist', async () => {
            mockRolePermissionRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
        });
    });
});