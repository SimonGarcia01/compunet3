import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    create(createUserInput: CreateUserInput) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async findOneUser(userId: number): Promise<User> {
        const user: User | null = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role', 'role.rolesPermissions', 'role.rolesPermissions.permission'],
        });

        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        return user;
    }
}
