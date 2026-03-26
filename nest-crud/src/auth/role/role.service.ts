import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { Role } from './role.entity';
import { RoleInput } from './dtos/roleInput.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    //Method to find a role using the name
    async findByName(name: string) {
        return this.roleRepository.findOneBy({ name });
    }

    findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findById(id: number): Promise<Role | null> {
        return this.roleRepository.findOneBy({ id });
    }

    async create(createRoleDto: Partial<RoleInput>): Promise<Role> {
        const { name, description } = createRoleDto;

        const role = this.roleRepository.create({
            name,
            description,
        });

        return this.roleRepository.save(role);
    }

    async update(id: number, updateRoleDto: Partial<RoleInput>): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return this.roleRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<DeleteResult> {
        return this.roleRepository.delete(id);
    }
}
