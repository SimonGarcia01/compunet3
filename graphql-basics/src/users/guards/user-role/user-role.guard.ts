import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Observable } from 'rxjs';
import { META_DATA } from 'src/users/decorators/role-protected.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const validRoles: string[] = this.reflector.get<string[]>(META_DATA, context.getHandler());

		if (!validRoles || validRoles.length === 0) {
			return true;
		}

		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		const user = request.user as User;

		if (!user) throw new BadRequestException('User not found in request');

		const hasValidRole = user.roles.some((role) => validRoles.includes(role));
		if (!hasValidRole)
			throw new ForbiddenException(`User {${user.email}} does not have the required roles`);

		return true;
	}
}
