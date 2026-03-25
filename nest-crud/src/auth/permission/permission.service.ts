import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { Permission } from './permission.entity';
import { PermissionInput } from './dtos/permissionInput.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    findAll(): Promise<Permission[]> {
        return this.permissionRepository.find();
    }

    async findById(id: number): Promise<Permission | null> {
        return this.permissionRepository.findOneBy({ id });
    }

    async create(createPermissionDto: Partial<PermissionInput>): Promise<Permission> {
        const { name, description } = createPermissionDto;

        const permission = this.permissionRepository.create({
            name,
            description,
        });

        return this.permissionRepository.save(permission);
    }

    async update(id: number, updatePermissionDto: Partial<PermissionInput>): Promise<Permission | null> {
        await this.permissionRepository.update(id, updatePermissionDto);
        return this.permissionRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<DeleteResult> {
        return this.permissionRepository.delete(id);
    }
}
