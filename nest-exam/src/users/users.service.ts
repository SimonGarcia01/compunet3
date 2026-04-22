import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User | null> {
        const newUser = this.userRepository.create({
            ...createUserDto,
            createdAt: new Date(),
        });

        return await this.userRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(userId: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id: userId });
    }
}
