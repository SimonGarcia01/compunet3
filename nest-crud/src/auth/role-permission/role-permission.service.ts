import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';

import { RolePermission } from './rolePermission.entity';
import { RolePermissionInput } from './dtos/rolePermissionInput.dto';

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    findAll(): Promise<RolePermission[]> {
        return this.rolePermissionRepository.find({ relations: ['role', 'permission'] });
    }

    async findById(roleId: number, permissionId: number): Promise<RolePermission | null> {
        return this.rolePermissionRepository.findOne({
            where: { role: { id: roleId }, permission: { id: permissionId } },
            relations: ['role', 'permission'],
        });
    }

    async create(createRolePermissionDto: RolePermissionInput): Promise<RolePermission> {
        const { roleId, permissionId } = createRolePermissionDto;

        const role = await this.roleRepository.findOneBy({ id: roleId });
        if (!role) {
            throw new Error('Role not found');
        }

        const permission = await this.permissionRepository.findOneBy({ id: permissionId });
        if (!permission) {
            throw new Error('Permission not found');
        }

        const rolePermission = this.rolePermissionRepository.create({
            role,
            permission,
        });

        return this.rolePermissionRepository.save(rolePermission);
    }

    async update(
        roleId: number,
        permissionId: number,
        updateRolePermissionDto: Partial<RolePermissionInput>,
    ): Promise<RolePermission | null> {
        // For junction tables, typically you delete and recreate
        // But if we need to update, we find by composite key and update
        const rolePermission = await this.rolePermissionRepository.findOne({
            where: { role: { id: roleId }, permission: { id: permissionId } },
            relations: ['role', 'permission'],
        });

        if (!rolePermission) {
            return null;
        }

        // Validate new role if provided
        if (updateRolePermissionDto.roleId && updateRolePermissionDto.roleId !== roleId) {
            const newRole = await this.roleRepository.findOneBy({
                id: updateRolePermissionDto.roleId,
            });
            if (!newRole) {
                throw new Error('New Role not found');
            }
            rolePermission.role = newRole;
        }

        // Validate new permission if provided
        if (updateRolePermissionDto.permissionId && updateRolePermissionDto.permissionId !== permissionId) {
            const newPermission = await this.permissionRepository.findOneBy({
                id: updateRolePermissionDto.permissionId,
            });
            if (!newPermission) {
                throw new Error('New Permission not found');
            }
            rolePermission.permission = newPermission;
        }

        return this.rolePermissionRepository.save(rolePermission);
    }

    async delete(roleId: number, permissionId: number): Promise<DeleteResult> {
        return this.rolePermissionRepository.delete({
            role: { id: roleId },
            permission: { id: permissionId },
        });
    }
}
