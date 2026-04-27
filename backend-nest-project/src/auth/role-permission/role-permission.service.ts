import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { Repository } from 'typeorm';
import { UserRole } from '../user-role/entities/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';

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
        const role = await this.roleRepository.findOne({
            where: { id: createRolePermissionDto.roleId },
        });
        if (!role) {
            throw new NotFoundException(`Role with id ${createRolePermissionDto.roleId} not found`);
        }
        const permission = await this.permissionRepository.findOne({
            where: { id: createRolePermissionDto.permissionId },
        });
        if (!permission) {
            throw new NotFoundException(`Permission with id ${createRolePermissionDto.permissionId} not found`);
        }

        const existing = await this.rolePermissionRepository.findOne({
            where: { role: { id: role.id }, permission: { id: permission.id } },
        });

        if (existing) {
            throw new ConflictException(`Role permission with role id ${createRolePermissionDto.roleId} and permission id ${createRolePermissionDto.permissionId} already exists`);
        }

        const rolePermission = this.rolePermissionRepository.create({
            role,
            permission,
        });
        return this.rolePermissionRepository.save(rolePermission);
    }

    async findAll() {
        return this.rolePermissionRepository.find({ relations: ['role', 'permission'] });
    }

    async findOne(id: number): Promise<RolePermission> {
        const rolePermission = await this.rolePermissionRepository.findOne({
            where: { id },
            relations: ['role', 'permission']
        });
        if (!rolePermission) {
            throw new NotFoundException(`Role permission with id ${id} not found`);
        }
        return rolePermission;

    }

    async remove(id: number): Promise<{ message: string }> {
        const rolePermission = await this.findOne(id);
        await this.rolePermissionRepository.remove(rolePermission);
        return { message: `Role permission with id ${id} has been removed` };
    }
}
