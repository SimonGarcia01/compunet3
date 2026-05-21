import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from './dto/signup.input';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
	create(createUserInput: CreateUserInput) {
		return 'This action adds a new user';
	}

	async signup(signupInput: SignupInput) {
		const user = this.userRepository.create(signupInput);
		await this.userRepository.save(user);
		return user;
	}

	findAll() {
		return `This action returns all users`;
	}

	async findOne(id: string) {
		try {
			return await this.userRepository.findOneByOrFail({ id: id });
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	// async update(id: string, updateUserInput: UpdateUserInput) {
	// 	try {
	// 		return await this.userRepository.update({ id }, updateUserInput);
	// 	} catch (error) {
	// 		throw new NotFoundException(error);
	// 	}
	// }

	async remove(id: string) {
		try {
			return await this.userRepository.delete({ id });
		} catch (error) {
			throw new NotFoundException(error);
		}
	}
}
