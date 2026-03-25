import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
    //You must make the constructor to inject the repository of the user entity
    //This basically skips the creation of the Repository file in Spring Boot
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    //All repository methods are async, but if you don't change the output or anything you can just return the promise directly
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // findById(id: number): Promise<User[]> {
    //     return this.userRepository.findBy({ id });
    // }

    async findById(id: number): Promise<User[]> {
        const result = await this.userRepository.findBy({ id });
        return result;
    }
}
