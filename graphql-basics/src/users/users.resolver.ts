import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.type';
import { ValidRoles } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth-decorator';

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
		return;
	}

	@Query(() => [User], { name: 'getAll' })
	@Auth(ValidRoles.ADMIN)
	findAll() {
		return this.usersService.findAll();
	}
}
