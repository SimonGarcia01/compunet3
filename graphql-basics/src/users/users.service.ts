import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService
	) {}
	create(createUserInput: CreateUserInput) {
		return 'This action adds a new user';
	}

	async signup(signupInput: SignupInput) {
		try {
			const user = this.userRepository.create({
				...signupInput,
				password: bcrypt.hashSync(signupInput.password, 10)
			});
			await this.userRepository.save(user);
			delete user.password;
			const token = this.getJwtToken({ id: user.id, email: user.email });
			return { user, token };
		} catch (error) {
			this.handleExceptions(error);
		}
	}

	async findOne(id: string) {
		try {
			return await this.userRepository.findOneByOrFail({ id: id });
		} catch (error) {
			this.handleExceptions(error);
		}
	}

	async login(loginInput: LoginInput) {
		try {
			const { email, password } = loginInput;
			const user = await this.findByEmail(email);

			if (!user) throw new NotFoundException(`User with email ${email} not found`);

			if (!bcrypt.compareSync(password, user.password!))
				throw new UnauthorizedException('Invalid credentials');

			const token = this.getJwtToken({
				id: user.id,
				email: user.email
			});

			return new AuthResponse(user, token);
		} catch (error) {
			this.handleExceptions(error);
		}
	}

	private async findByEmail(email: string) {
		try {
			return await this.userRepository.findOneByOrFail({ email });
		} catch (error) {
			this.handleExceptions(error);
		}
	}

	private handleExceptions(error: any) {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail.replace('key', ''));
		}

		if (error.code === 'error-001') {
			throw new BadRequestException(error.detail.replace('key', ''));
		}

		throw new InternalServerErrorException('Please check your server logs.');
	}

	private getJwtToken(payload: JwtPayload) {
		const token = this.jwtService.sign(payload);
		return token;
	}
	// findAll() {
	// 	return `This action returns all users`;
	// }

	// async update(id: string, updateUserInput: UpdateUserInput) {
	// 	try {
	// 		return await this.userRepository.update({ id }, updateUserInput);
	// 	} catch (error) {
	// 		throw new NotFoundException(error);
	// 	}
	// }

	// async remove(id: string) {
	// 	try {
	// 		return await this.userRepository.delete({ id });
	// 	} catch (error) {
	// 		throw new NotFoundException(error);
	// 	}
	// }
}
