import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Resolver('User')
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Query(() => User, { name: 'user' })
	findOne(@Args('id', { type: () => String }) id: string) {
		console.log(id);
		throw new Error('Method not implemented.');
	}
}
