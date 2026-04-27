import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const existingPermission = await this.permissionRepository.findOne({
            where: { name: createPermissionDto.name },
        });

        if (existingPermission) {
            throw new ConflictException('Permission already exists');
        }

        const permission = this.permissionRepository.create(createPermissionDto);
        return this.permissionRepository.save(permission);

    }

    async findAll(): Promise<Permission[]> {
        return this.permissionRepository.find();
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException('Permission not found');
        }

        return permission;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        const permission = await this.findOne(id);
        Object.assign(permission, updatePermissionDto);
        return this.permissionRepository.save(permission);
    }

    async remove(id: number): Promise<{ message: string }> {
        const permission = await this.findOne(id);
        await this.permissionRepository.remove(permission);
        return { message: 'Permission removed successfully' };
    }
}
