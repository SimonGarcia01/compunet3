import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleNotFoundException } from '@/common/exceptions/http/role-not-found-exception';
import { UserNotFoundException } from '@/common/exceptions/http/user-not-found-exception';
import { AppLogger } from '@/common/logger/logger.service';

import { User } from '../entities/user.entity';
import { RoleService } from '../role/role.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private roleService: RoleService,
        private readonly logger: AppLogger,
    ) {}

    async findByUsername(username: string): Promise<User | null> {
        //Look for the user using the username
        return await this.userRepository.findOne({
            //This is the where that looks for the user by username
            where: { username },
            //This forces it to also fetch the info of the roles and permissions
            //You have to start with the role and rolePermissions because the user has a relation
            // with the role and the role has a relation with the permissions which then
            // allows you to access the permissions of the user
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
        });
    }

    async create(createUserDto: CreateUserDto) {
        const role = await this.roleService.findByName(createUserDto.roleName);
        if (!role) {
            throw new RoleNotFoundException(createUserDto.roleName);
        }

        const newUser = this.userRepository.create({
            ...createUserDto,
            role,
        });
        return await this.userRepository.save(newUser);
    }

    findAll() {
        this.logger.debug('Fetching all users');
        return this.userRepository.find();
    }

    findOne(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }
    // /**
    //  * Find one user with their role
    //  */
    // findOne(id: number) {
    //     return this.userRepository.findOne({
    //         where: { id },
    //         relations: ['role'],
    //     });
    // }

    // /**
    //  * Find user with role and permissions
    //  */
    // async findOneWithPermissions(id: number) {
    //     return await this.userRepository.findOne({
    //         where: { id },
    //         relations: ['role', 'role.permissions'],
    //     });
    // }

    // /**
    //  * Find all users with their roles and permissions
    //  */
    // async findAllWithPermissions() {
    //     return await this.userRepository.find({
    //         relations: ['role', 'role.permissions'],
    //         order: { createdAt: 'DESC' },
    //     });
    // }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.userRepository.delete(id);
        if (!result.affected || result.affected === 0) {
            throw new UserNotFoundException(id);
        }
    }

    /**
     * Find all users with pagination and sorting
     */
    async findAllPage(page = 1, limit = 10, sortBy = 'createdAt', order: 'ASC' | 'DESC' = 'DESC') {
        const [users, total] = await this.userRepository.findAndCount({
            relations: ['role'],
            skip: (page - 1) * limit,
            take: limit,
            order: { [sortBy]: order },
        });

        return {
            data: users,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    /**
     * Find users by role name
     */
    async findByRole(roleName: string) {
        return await this.userRepository.find({
            where: { role: { name: roleName } },
            relations: ['role'],
            order: { username: 'ASC' },
        });
    }

    /**
     * Count total users
     */
    async count(): Promise<number> {
        return await this.userRepository.count();
    }

    /**
     * Count users by role
     */
    async countByRole(roleName: string): Promise<number> {
        return await this.userRepository.count({
            where: { role: { name: roleName } },
        });
    }
}
