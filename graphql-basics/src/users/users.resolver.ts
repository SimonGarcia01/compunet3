import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.type';

@Resolver('User')
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Query(() => User, { name: 'user' })
	findOne(@Args('id', { type: () => String }) id: string) {
		return this.usersService.findOne(id);
	}

	@Mutation(() => User, { name: 'signup' })
	signup(@Args('signupInput') signupInput: SignupInput) {
		return this.usersService.signup(signupInput);
	}

	@Mutation(() => AuthResponse, { name: 'login' })
	async login(@Args('loginInput') loginInput: LoginInput) {
		return await this.usersService.login(loginInput);
	}
}
