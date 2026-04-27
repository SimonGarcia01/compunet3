import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Role } from '../role/entities/role.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRoleService {

    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}    
    
    async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
        const user = await this.userRepository.findOne({
            where: { id: createUserRoleDto.userId },
        });
        if (!user) {
            throw new NotFoundException(`User with id ${createUserRoleDto.userId} not found`);
        }

        const role = await this.roleRepository.findOne({
            where: { id: createUserRoleDto.roleId },
        });
        if (!role) {
            throw new NotFoundException(`Role with id ${createUserRoleDto.roleId} not found`);
        }

        const existing = await this.userRoleRepository.findOne({
            where: { user: { id: user.id }, role: { id: role.id } },
        });
        if (existing) {
            throw new ConflictException(`User ${user.id} already has role ${role.id}`);
        }

        const userRole = this.userRoleRepository.create({ user, role });
        return this.userRoleRepository.save(userRole);
    }

    async findAll(): Promise<UserRole[]> {
        return this.userRoleRepository.find({ relations: ['user', 'role'] });
    }

    async findOne(id: number): Promise<UserRole> {
        const userRole = await this.userRoleRepository.findOne({
            where: { id },
            relations: ['user', 'role'],
        });
        if (!userRole) {
            throw new NotFoundException(`User role with id ${id} not found`);
        }
        return userRole;
    }

    async remove(id: number): Promise<{ message: string }> {
        const userRole = await this.findOne(id);
        await this.userRoleRepository.remove(userRole);
        return { message: `User role with id ${id} deleted successfully` }; 
    }
}
