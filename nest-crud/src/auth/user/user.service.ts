import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { Role } from '../role/role.entity';

import { User } from './user.entity';
import { UserInput } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
    //You must make the constructor to inject the repository of the user entity
    //This basically skips the creation of the Repository file in Spring Boot
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) {}

    //All repository methods are async, but if you don't change the output or anything you can just return the promise directly
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // findById(id: number): Promise<User[]> {
    //     return this.userRepository.findBy({ id });
    // }

    async findById(id: number): Promise<User | null> {
        const result = await this.userRepository.findOneBy({ id });
        return result;
    }

    async create(createUserDto: Partial<UserInput>): Promise<User> {
        //Destructure the input to get the roleID mainly
        const { name, email, password, roleId } = createUserDto;
        //Find the role by the roleID
        const role = await this.roleRepository.findOneBy({ id: roleId });
        //If the role doesn't exist, throw an error
        if (!role) {
            throw new Error('Role not found');
        }

        //Create the user entity usint the create method
        const user = this.userRepository.create({
            name,
            email,
            encryptedPassword: password,
            role,
        });

        //Now you must save the user into the db
        return this.userRepository.save(user);
    }

    async update(id: number, updateUserDto: Partial<UserInput>): Promise<User | null> {
        // Validate role exists if roleId is being updated
        if (updateUserDto.roleId) {
            const role = await this.roleRepository.findOneBy({ id: updateUserDto.roleId });
            if (!role) {
                throw new Error('Role not found');
            }
        }

        //Update the user with the new data
        await this.userRepository.update(id, updateUserDto);
        //Return the updated user
        return this.userRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }
}
