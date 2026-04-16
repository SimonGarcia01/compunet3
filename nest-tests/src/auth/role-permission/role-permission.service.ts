import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';

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

    async create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission> {
        const role = await this.roleRepository.findOneBy({ id: createRolePermissionDto.roleId });
        if (!role) {
            throw new NotFoundException(`Role with id ${createRolePermissionDto.roleId} not found`);
        }

        const permission = await this.permissionRepository.findOneBy({ id: createRolePermissionDto.permissionId });
        if (!permission) {
            throw new NotFoundException(`Permission with id ${createRolePermissionDto.permissionId} not found`);
        }

        await this.ensureNoDuplicate(role.id, permission.id);

        const rolePermission = this.rolePermissionRepository.create({ role, permission });
        const saved = await this.rolePermissionRepository.save(rolePermission);
        return (await this.findOne(saved.id)) as RolePermission;
    }

    async findAll(): Promise<RolePermission[]> {
        return await this.rolePermissionRepository.find({
            relations: ['role', 'permission'],
        });
    }

    async findOne(id: number): Promise<RolePermission | null> {
        return await this.rolePermissionRepository.findOne({
            where: { id },
            relations: ['role', 'permission'],
        });
    }

    async update(id: number, updateRolePermissionDto: UpdateRolePermissionDto): Promise<RolePermission | null> {
        const current = await this.rolePermissionRepository.findOne({
            where: { id },
            relations: ['role', 'permission'],
        });

        if (!current) {
            throw new NotFoundException(`RolePermission with id ${id} not found`);
        }

        let role = current.role;
        let permission = current.permission;

        if (updateRolePermissionDto.roleId) {
            const nextRole = await this.roleRepository.findOneBy({ id: updateRolePermissionDto.roleId });
            if (!nextRole) {
                throw new NotFoundException(`Role with id ${updateRolePermissionDto.roleId} not found`);
            }
            role = nextRole;
        }

        if (updateRolePermissionDto.permissionId) {
            const nextPermission = await this.permissionRepository.findOneBy({
                id: updateRolePermissionDto.permissionId,
            });
            if (!nextPermission) {
                throw new NotFoundException(`Permission with id ${updateRolePermissionDto.permissionId} not found`);
            }
            permission = nextPermission;
        }

        await this.ensureNoDuplicate(role.id, permission.id, id);

        current.role = role;
        current.permission = permission;

        const updated = await this.rolePermissionRepository.save(current);
        return await this.findOne(updated.id);
    }

    async remove(id: number): Promise<{ id: number }> {
        const result = await this.rolePermissionRepository.delete(id);
        if (!result.affected || result.affected === 0) {
            throw new NotFoundException(`RolePermission with id ${id} not found`);
        }

        return { id };
    }

    private async ensureNoDuplicate(roleId: number, permissionId: number, excludeId?: number): Promise<void> {
        const query = this.rolePermissionRepository
            .createQueryBuilder('rp')
            .leftJoin('rp.role', 'role')
            .leftJoin('rp.permission', 'permission')
            .where('role.id = :roleId', { roleId })
            .andWhere('permission.id = :permissionId', { permissionId });

        if (excludeId) {
            query.andWhere('rp.id != :excludeId', { excludeId });
        }

        const duplicate = await query.getOne();
        if (duplicate) {
            throw new BadRequestException('RolePermission already exists for this role and permission');
        }
    }
}
