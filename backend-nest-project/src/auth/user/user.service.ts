import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserBadgeService } from 'src/badge/user-badge/user-badge.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userBadgeService: UserBadgeService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const userExists = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (userExists) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const userExists = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (userExists) {
                throw new ConflictException('User with this email already exists');
            }
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<{ message: string }> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
        return { message: `User with ID ${id} removed successfully` };
    }

    async findByEmailWithRoles(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: [
                'usersRoles',
                'usersRoles.role',
                'usersRoles.role.rolesPermissions',
                'usersRoles.role.rolesPermissions.permission',
            ],
        });
    }

    async addXp(userId: number, amount: number): Promise<User> {
        const user = await this.findOne(userId);
        user.xp += amount;

        const newLevel = Math.floor(user.xp / 100) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
            await this.userRepository.save(user);
            await this.userBadgeService.checkAndAwardBadges(userId, newLevel);
            return user;
        }

        return await this.userRepository.save(user);
    }
}
