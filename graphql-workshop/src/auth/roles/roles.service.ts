import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOne({ where: { id } });
    }
}
