import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleNotFoundException } from '@/common/exceptions/http/role-not-found-exception';

import { Role } from '../entities/role.entity';

import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.findByName(createRoleDto.name);
        if (existingRole) {
            throw new ConflictException(`Role with name ${createRoleDto.name} already exists`);
        }

        const newRole = this.roleRepository.create(createRoleDto);
        const savedRole = await this.roleRepository.save(newRole);
        return (await this.findOne(savedRole.id)) as Role;
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find({
            relations: ['rolePermissions', 'rolePermissions.permission'],
        });
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: { id },
            relations: ['rolePermissions', 'rolePermissions.permission'],
        });
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return await this.findOne(id);
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.roleRepository.delete(id);
        if (!result.affected || result.affected === 0) {
            throw new RoleNotFoundException(id);
        }

        return { id };
    }

    async findByName(name: string): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ name });
    }
}
