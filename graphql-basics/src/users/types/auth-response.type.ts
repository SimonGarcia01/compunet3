import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class AuthResponse {
	@Field(() => User)
	user!: User;

	@Field(() => String)
	token!: string;

	constructor(user: User, token: string) {
		this.user = user;
		this.token = token;
	}
}
